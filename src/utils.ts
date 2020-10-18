import { SchematicContext } from '@angular-devkit/schematics';
import { spawn, SpawnOptions } from 'child_process';

/**
 * install the '@schematics/angular' package temporarily to execute Angular CLI included schematics
 */
export const installNpmPackage = (
  context: SchematicContext,
  packageName: string,
) => {
  return new Promise<boolean>((resolve) => {
    context.logger.info(
      `📦 Installing package '${packageName}' for external schematic setup...`,
    );
    const spawnOptions: SpawnOptions = { stdio: 'inherit' };
    spawn('npm', ['install', packageName], spawnOptions).on(
      'close',
      (code: number) => {
        if (code === 0) {
          context.logger.info(
            `✅ '${packageName}' package installed successfully`,
          );
          resolve(true);
        } else {
          const errorMessage = `❌ installation of '${packageName}' package failed`;
          context.logger.error(errorMessage);
          throw new Error();
        }
      },
    );
  });
};
