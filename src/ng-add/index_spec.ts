import { resolve } from 'path';
import { HostTree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { NgAddSchema } from './schema';
import { setupProject } from '../test-utils';
import * as utils from '../utils';
import * as schematicOperations from '@angular-devkit/schematics';

function fixedSpyOn<T>(target: T, prop: keyof T): jasmine.Spy {
  const spy = jasmine.createSpy(`${prop}Spy`);
  spyOnProperty(target, prop).and.returnValue(spy);
  return spy;
}

describe('ng-add schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    'awesome-candy-enterprises',
    resolve(__dirname, '../collection.json'),
  );
  const project = 'foo';
  const defaultOptions: NgAddSchema = {};

  let projectTree: UnitTestTree;
  let appTree: UnitTestTree;

  beforeEach(async () => {
    const testTree = new UnitTestTree(new HostTree());
    projectTree = await setupProject(testTree, schematicRunner, project);
    spyOn(utils, 'installNpmPackage').and.resolveTo();

    // errors
    // @see: https://github.com/jasmine/jasmine/issues/1817
    fixedSpyOn(
      schematicOperations,
      'externalSchematic',
    ).and.returnValue((_tree: any, _context: any) => {});
  });

  describe('when using the default options', () => {
    beforeEach(async () => {
      appTree = await schematicRunner
        .runSchematicAsync('ng-add', defaultOptions, projectTree)
        .toPromise();
    });

    it(`should add the renovate file`, () => {
      const filePath = '/renovate.json';
      expect(appTree.files).toContain(filePath);
    });
  });
});
