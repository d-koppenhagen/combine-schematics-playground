import {
  Rule,
  SchematicContext,
  Tree,
  externalSchematic,
  schematic,
  chain,
  empty,
  apply,
  mergeWith,
  move,
  MergeStrategy,
  template,
  url
} from '@angular-devkit/schematics';

import {
  Schema as AngularNgNewSchema,
  PackageManager,
  Style,
} from '@schematics/angular/ng-new/schema';
import { spawn } from 'child_process';
import { strings } from '@angular-devkit/core';

import { NgNewSchema as Schema } from './schema';
import { NgAddSchema } from '../ng-add/schema';

export default (options: Schema): Rule => {
  return async (_tree: Tree, context: SchematicContext) => {
    options.projectName = strings.dasherize(options.projectName);
    const angularSchematicsPackage = '@schematics/angular';
    const projectName = options.projectName;
    const ngNewOptions: AngularNgNewSchema = {
      version: '10.1.0',
      name: projectName,
      routing: true,
      strict: true,
      style: options.style as Style,
      packageManager: PackageManager.Npm,
      prefix: 'candy'
    };
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

    return chain([
      mergeWith(
        apply(empty(), [
          externalSchematic(angularSchematicsPackage, 'ng-new', ngNewOptions),
          addNewProjectFiles(options),
          runNgAdd(options),
          move(options.projectName),
        ]),
      )
    ]);
  };
};


const addNewProjectFiles = (options: Schema): Rule => (
  tree: Tree,
  context: SchematicContext,
) => {
  context.logger.info('🍭 Setup candy enterprises project');
  const sourceTemplates = url('./files');
  const sourceParameterizedTemplates = apply(sourceTemplates, [
    template({
      ...strings,
      ...options,
    }),
    move('/', options.projectName),
  ]);
  return mergeWith(sourceParameterizedTemplates, MergeStrategy.Overwrite)(tree, context);
};

const runNgAdd = (options: Schema): Rule => (
  _tree: Tree,
  _context: SchematicContext,
) => {
  const ngAddOptions: NgAddSchema = {
    projectName: options.projectName,
    style: options.style,
  };
  return schematic('ng-add', ngAddOptions);
};
