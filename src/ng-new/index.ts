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

export default function(options: NgNewSchema): Rule {
  if (!options.name) {
    throw new SchematicsException(`Invalid options, "name" is required.`);
  }

  const directory = options.name;

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

  const angularSchematicsPackage = '@schematics/angular';

  return chain([
    async (_host: Tree, context: SchematicContext) => {
      await new Promise<boolean>((resolve) => {
        context.logger.info('📦  Installing packages for setup...');
        spawn('npm', ['install', angularSchematicsPackage]).on(
          'close',
          (code: number) => {
            if (code === 0) {
              context.logger.info('📦  Packages installed successfully ✅');
              resolve(true);
            } else {
              const errorMessage = `❌ install Angular schematics from '${angularSchematicsPackage}' failed`;
              context.logger.error(errorMessage);
              throw new Error();
            }
          },
        );
      });
    },
    mergeWith(
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
        move(directory),
      ]),
    ),
    (_host: Tree, context: SchematicContext) => {
      let packageTask;

      packageTask = context.addTask(
        new NodePackageInstallTask({
          workingDirectory: directory,
          packageManager: PackageManager.Npm,
        }),
      );

      packageTask = context.addTask(
        new NodePackageLinkTask('@angular/cli', directory),
        [packageTask],
      );

      context.addTask(
        new RepositoryInitializerTask(
          directory,
          {},
        ),
        packageTask ? [packageTask] : [],
      );
    },
  ]);
}