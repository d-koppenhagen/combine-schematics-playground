import { strings } from '@angular-devkit/core';
import {
  apply,
  Rule,
  SchematicContext,
  Tree,
  url,
  template,
  mergeWith,
  MergeStrategy,
} from '@angular-devkit/schematics';

export const applyTemplatesFromFilesDir = <T>(options: T): Rule => (
  _tree: Tree,
  _context: SchematicContext,
) => {
  const sourceTemplates = url('./files');
  const sourceParameterizedTemplates = apply(sourceTemplates, [
    template({
      ...strings,
      ...options,
    }),
  ]);
  return mergeWith(sourceParameterizedTemplates, MergeStrategy.Overwrite);
};
