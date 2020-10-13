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
import {
  getWorkspacePath /*, getWorkspace*/,
} from '@schematics/angular/utility/config';
import { NgAddSchema } from './schema';
import { HeaderSchema } from '../header/schema';

export default (options: NgAddSchema): Rule => {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('🍭 Apply ng-add schematics');

    const targetPath = options.projectName || getWorkspacePath(tree);
    const sourceTemplates = url('./files');
    const sourceParameterizedTemplates = apply(sourceTemplates, [
      template({
        ...strings,
        ...options,
      }),
      move('/', targetPath),
    ]);
    return chain([
      mergeWith(sourceParameterizedTemplates),
      addCandyComponents(options),
    ])(tree, context);
  };
};

const addCandyComponents = (options: NgAddSchema): Rule => (
  tree: Tree,
  _context: SchematicContext,
) => {
  const targetPath = options.projectName || getWorkspacePath(tree);

  const heraderOptions: HeaderSchema = {
    projectName: targetPath,
    style: options.style
  };
  return schematic('header', heraderOptions);
};

