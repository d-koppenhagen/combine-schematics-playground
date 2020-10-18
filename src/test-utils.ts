import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

export async function setupProject(
  unitTestTree: UnitTestTree,
  schematicRunner: SchematicTestRunner,
  name: string,
) {
  const workspaceTree = await schematicRunner
    .runExternalSchematicAsync(
      '@schematics/angular',
      'workspace',
      {
        name,
        version: '10.1.0',
        newProjectRoot: '',
      },
      unitTestTree,
    )
    .toPromise();

  return await schematicRunner
    .runExternalSchematicAsync(
      '@schematics/angular',
      'application',
      {
        name,
        projectRoot: '',
      },
      workspaceTree,
    )
    .toPromise();
}
