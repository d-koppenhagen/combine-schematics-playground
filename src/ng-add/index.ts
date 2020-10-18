import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  Tree,
  url,
  apply,
  mergeWith,
  template,
  chain,
  schematic,
  externalSchematic
} from '@angular-devkit/schematics';
import { NgAddSchema } from './schema';
import { HeaderSchema } from '../header/schema';
import { installNpmPackage } from '../utils';

export default (options: NgAddSchema): Rule => {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('🍭 Apply ng-add schematics');

    const sourceTemplates = url('./files');
    const sourceParameterizedTemplates = apply(sourceTemplates, [
      template({
        ...strings,
        ...options,
      }),
    ]);
    return chain([
      mergeWith(sourceParameterizedTemplates),
      addCandyComponents(options),
      addCypress(options),
      addSemanticVersioningTooling(options),
    ])(tree, context);
  };
};

const addCandyComponents = (options: NgAddSchema): Rule => (
  _tree: Tree,
  _context: SchematicContext,
) => {
  const heraderOptions: HeaderSchema = {
    style: options.style
  };
  return schematic('header', heraderOptions);
};

const addSemanticVersioningTooling = (_options: NgAddSchema): Rule => async (
  _tree: Tree,
  context: SchematicContext,
) => {
  const packageName = 'ngx-semantic-version';
  await installNpmPackage(context, packageName);
  return externalSchematic(packageName, 'ng-add', {});
};

const addCypress = (_options: NgAddSchema): Rule => async (
  _tree: Tree,
  context: SchematicContext,
) => {
  const packageName = '@briebug/cypress-schematic';
  await installNpmPackage(context, packageName);
  return externalSchematic(packageName, 'ng-add', {
    removeProtractor: true,
    addCypressTestScripts: true,
  });
};

