import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  schematic,
  externalSchematic,
} from '@angular-devkit/schematics';
import { NgAddSchema } from './schema';
import { HeaderSchema } from '../header/schema';
import { applyTemplatesFromFilesDir/*, installNpmPackage*/ } from '../utils';

export default (options: NgAddSchema): Rule => {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('🍭 Apply ng-add schematics');
    return chain([
      applyTemplatesFromFilesDir(options),
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
    style: options.style,
  };
  return schematic('header', heraderOptions);
};

const addSemanticVersioningTooling = (_options: NgAddSchema): Rule => async (
  _tree: Tree,
  _context: SchematicContext,
) => {
  const packageName = 'ngx-semantic-version';
  // await installNpmPackage(context, packageName);
  return externalSchematic(packageName, 'ng-add', {
    packages: [
      'commitlint', 'commitizen', 'husky', 'standard-version'
    ]
  });
};

const addCypress = (_options: NgAddSchema): Rule => async (
  _tree: Tree,
  _context: SchematicContext,
) => {
  const packageName = '@briebug/cypress-schematic';
  // await installNpmPackage(context, packageName);
  return externalSchematic(packageName, 'ng-add', {
    removeProtractor: true,
    addCypressTestScripts: true,
  });
};
