import {
  Rule,
  SchematicContext,
  Tree,
  externalSchematic
} from '@angular-devkit/schematics';
// import { getWorkspacePath } from '@schematics/angular/utility/config';
import {
  Schema as componentOptions
} from '@schematics/angular/component/schema';
import { HeaderSchema } from './schema';

export default (options: HeaderSchema): Rule => {
  return (_tree: Tree, context: SchematicContext) => {
    context.logger.info('🍭 Adding candy header');
    const componentOptions: componentOptions = {
      name: 'header',
      project: options.project,
      path: 'src/app',
      skipImport: false
    };
    return externalSchematic('@schematics/angular', 'component', componentOptions);
  };
};
