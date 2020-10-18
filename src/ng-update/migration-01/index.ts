import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export default (_options: any): Rule => {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('✨ Migration executed');
    return tree;
  };
};
