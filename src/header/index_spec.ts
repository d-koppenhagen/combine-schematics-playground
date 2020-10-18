import { resolve } from 'path';
import { HostTree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { getFileContent } from '@schematics/angular/utility/test';
import { HeaderSchema } from './schema';
import { setupProject } from '../test-utils';

describe('header schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    'awesome-candy-enterprises',
    resolve(__dirname, '../collection.json'),
  );
  const project = 'foo';
  const defaultOptions: HeaderSchema = {};

  let projectTree: UnitTestTree;
  let appTree: UnitTestTree;

  beforeEach(async () => {
    const testTree = new UnitTestTree(new HostTree());
    projectTree = await setupProject(testTree, schematicRunner, project);
  });

  describe('when using the default options', () => {
    beforeEach(async () => {
      appTree = await schematicRunner
        .runSchematicAsync('header', defaultOptions, projectTree)
        .toPromise();
    });

    it(`should add header HTML template file`, () => {
      const filePath = '/src/app/header/header.component.html';
      expect(appTree.files).toContain(filePath);
      const fileContent = getFileContent(appTree, filePath);
      expect(fileContent).toMatch(/<nav>.*<\/nav>/s);
    });

    it(`should add header SCSS file`, () => {
      const filePath = '/src/app/header/header.component.scss';
      expect(appTree.files).toContain(filePath);
      const fileContent = getFileContent(appTree, filePath);
      expect(fileContent).toMatch(/nav {.*}/s);
    });

    it(`should import and declare the component in the AppModule`, () => {
      const filePath = '/src/app/app.module.ts';
      const fileContent = getFileContent(appTree, filePath);
      expect(fileContent).toContain(
        `import { HeaderComponent } from './header/header.component';`,
      );
      expect(fileContent).toMatch(
        /@NgModule\({.*declarations:.*HeaderComponent/s,
      );
    });
  });

  describe('when using CSS stylesheet', () => {
    beforeEach(async () => {
      appTree = await schematicRunner
        .runSchematicAsync(
          'header',
          { ...defaultOptions, style: 'css' },
          projectTree,
        )
        .toPromise();
    });

    it(`should add header CSS file`, () => {
      const filePath = '/src/app/header/header.component.css';
      expect(appTree.files).toContain(filePath);
      const fileContent = getFileContent(appTree, filePath);
      expect(fileContent).toMatch(/nav {.*}/s);
    });
  });
});
