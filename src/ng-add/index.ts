import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  Tree,
  url,
  apply,
  mergeWith,
  template,
  move,
  chain,
  schematic
} from '@angular-devkit/schematics';
import { NgAddSchema } from './schema';
import { HeaderSchema } from '../header/schema';

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

