import { resolve } from 'path';
import { HostTree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { getFileContent } from '@schematics/angular/utility/test';
import { NgAddSchema } from './schema';
import { setupProject } from '../test-utils';

const PACKAGE_JSON_PATH = '/package.json';

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

    it(`will set up ngx-semantic-version`, () => {
      const packageJson = JSON.parse(getFileContent(appTree, PACKAGE_JSON_PATH));

      const filePath = '/commitlint.config.js';
      expect(appTree.files).toContain(filePath);
      const fileContent = getFileContent(appTree, filePath);
      expect(fileContent).not.toMatch(/rules: {\s+\'references-empty\': \[2, \'never\'\].\s+\},/g);
      expect(fileContent).not.toMatch(
        /parserPreset: {\s+parserOpts: \{\s+issuePrefixes: \[\'\PREFIX-\'\],\s+},\s+},/g,
      );

      const { devDependencies, scripts, husky, config } = packageJson;
      expect(appTree.files).toContain(PACKAGE_JSON_PATH);
      expect(devDependencies['@commitlint/cli']).toBeDefined();
      expect(devDependencies['@commitlint/config-conventional']).toBeDefined();
      expect(devDependencies.commitizen).toBeDefined();
      expect(devDependencies['cz-conventional-changelog']).toBeDefined();
      expect(devDependencies.husky).toBeDefined();
      expect(devDependencies['standard-version']).toBeDefined();
      expect(scripts.release).toEqual('standard-version');
      expect(husky.hooks['commit-msg']).toEqual('commitlint -E HUSKY_GIT_PARAMS');
      expect(config.commitizen.path).toEqual('./node_modules/cz-conventional-changelog');
    });
  });
});
