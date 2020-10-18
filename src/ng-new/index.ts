import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  apply,
  chain,
  empty,
  mergeWith,
  move,
  schematic,
  externalSchematic,
  template,
  url,
  MergeStrategy,
} from '@angular-devkit/schematics';
import {
  NodePackageInstallTask,
  NodePackageLinkTask,
  RepositoryInitializerTask,
} from '@angular-devkit/schematics/tasks';
import {
  Style,
} from '@schematics/angular/ng-new/schema';
import {
  Schema as AngularWorkspaceSchema,
  PackageManager,
} from '@schematics/angular/workspace/schema';
import {
  Schema as ApplicationSchema,
} from '@schematics/angular/application/schema';
import { NgNewSchema } from './schema';
import { NgAddSchema } from '../ng-add/schema';
import { spawn } from 'child_process';
import { strings } from '@angular-devkit/core';

const angularSchematicsPackage = '@schematics/angular';

export default function(options: NgNewSchema): Rule {
  if (!options.name) {
    throw new SchematicsException(`Invalid options, "name" is required.`);
  }
  return chain([
    installAngularSchematicsPackageForSetup(),
    setupWorkspace(options),
    finishSetup(options),
    removeInstalledAngularSchematicsPackageForSetup(),
  ]);
}

/**
 * install the '@schematics/angular' package temporarily to execute Angular CLI included schematics
 */
const installAngularSchematicsPackageForSetup = (): Rule => (
  _tree: Tree,
  _context: SchematicContext,
) => {
  return async (_host: Tree, context: SchematicContext) => {
    await new Promise<boolean>((resolve) => {
      context.logger.info(`📦 Installing package '${angularSchematicsPackage}' for setup...`);
      spawn('npm', ['install', angularSchematicsPackage]).on(
        'close',
        (code: number) => {
          if (code === 0) {
            context.logger.info(`✅ '${angularSchematicsPackage}' package installed successfully`);
            resolve(true);
          } else {
            const errorMessage = `❌ installation of '${angularSchematicsPackage}' package failed`;
            context.logger.error(errorMessage);
            throw new Error();
          }
        },
      );
    });
  }
};

const setupWorkspace = (options: NgNewSchema): Rule => (
  _tree: Tree,
  _context: SchematicContext,
) => {
  const workspaceOptions: AngularWorkspaceSchema = {
    name: options.name,
    version: '10.1.0',
    newProjectRoot: 'projects',
    minimal: false,
    strict: true,
    packageManager: PackageManager.Npm,
  };

  const applicationOptions: ApplicationSchema = {
    projectRoot: '',
    name: options.name,
    prefix: 'candy',
    routing: true,
    style: Style.Scss,
    skipPackageJson: false,
    // always 'skipInstall' here, so that we do it after the move
    skipInstall: true,
    strict: true,
    minimal: false,
    legacyBrowsers: false,
  };

  const candyAppOptions: NgAddSchema = {
    style: Style.Scss
  };

  return mergeWith(
    apply(empty(), [
      externalSchematic(angularSchematicsPackage, 'workspace', workspaceOptions),
      externalSchematic(angularSchematicsPackage, 'application', applicationOptions),
      (tree: Tree, context: SchematicContext) => {
        context.logger.info('🍭 Apply ng-new schematics');

        const sourceTemplates = url('./files');
        const sourceParameterizedTemplates = apply(sourceTemplates, [
          template({
            ...strings,
            ...options,
          }),
        ]);
        return mergeWith(sourceParameterizedTemplates, MergeStrategy.Overwrite);
      },
      schematic('ng-add', candyAppOptions),
      move(options.name),
    ]),
  );
};

const finishSetup = (options: NgNewSchema): Rule => (
  _tree: Tree,
  context: SchematicContext,
) => {
  let packageTask;

  packageTask = context.addTask(
    new NodePackageInstallTask({
      workingDirectory: options.name,
      packageManager: PackageManager.Npm,
    }),
  );

  // packageTask = context.addTask(
  //   new NodePackageLinkTask('@angular/cli', options.name),
  //   [packageTask],
  // );

  context.addTask(
    new RepositoryInitializerTask(
      options.name,
      {},
    ),
    packageTask ? [packageTask] : [],
  );
};

const removeInstalledAngularSchematicsPackageForSetup = (): Rule => (
  _tree: Tree,
  _context: SchematicContext,
) => {
  return async (_host: Tree, context: SchematicContext) => {
    await new Promise<boolean>((resolve) => {
      context.logger.info(`🗑 Removing temporarily installed '${angularSchematicsPackage}' package`);
      spawn('rm', ['-rf', 'node_modules', 'package-lock.json']).on(
        'close',
        (code: number) => {
          if (code === 0) {
            context.logger.info(`✅ Cleanup of temporarily installed package '${angularSchematicsPackage}' was successfull`);
            resolve(true);
          } else {
            const errorMessage = `❌ Cleanup of temporarily installed package '${angularSchematicsPackage}' failed`;
            context.logger.error(errorMessage);
            throw new Error();
          }
        },
      );
    });
  }
};