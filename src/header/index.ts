import {
  Rule,
  SchematicContext,
  Tree,
  externalSchematic,
  chain,
} from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';
import { Schema as componentOptions } from '@schematics/angular/component/schema';
import { HeaderSchema } from './schema';
import { applyTemplatesFromFilesDir } from '../utils';

export default (options: HeaderSchema): Rule => {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('🍭 Adding candy header');
    const workspaceConfig = getWorkspace(tree);
    const project = options.project || workspaceConfig.defaultProject;
    const componentOptions: componentOptions = {
      name: 'header',
      prefix: project ? workspaceConfig.projects[project].prefix : '',
      project: options.project,
      path: 'src/app',
      skipImport: false,
    };
    return chain([
      externalSchematic('@schematics/angular', 'component', componentOptions),
      applyTemplatesFromFilesDir(options),
    ]);
  };
};
