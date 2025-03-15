import { GeneratorResourceScrapperSchema } from './schema';
import { names, readProjectConfiguration, Tree, updateProjectConfiguration } from '@nx/devkit';

export const defineWebpackBuildTarget = (options: GeneratorResourceScrapperSchema, tree: Tree) => {
  const projectName = names(options.name).fileName;
  const projectConfig = readProjectConfiguration(tree, projectName);
  if (!projectConfig?.targets) {
    throw new Error(`config file for "${projectName}" project doesn't exist.`);
  }
  projectConfig.targets.build = {
    executor: '@nx/webpack:webpack',
    outputs: ['{options.outputPath}'],
    defaultConfiguration: 'production',
    options: {
      target: 'node',
      compiler: 'tsc',
      outputPath: `dist/{projectRoot}`,
      main: `{projectRoot}/src/main.ts`,
      tsConfig: `{projectRoot}/tsconfig.app.json`,
      isolatedConfig: true,
      sourceMap: true,
      generatePackageJson: true,
      webpackConfig: `{projectRoot}/webpack.config.js`,
      assets: [],
      additionalEntryPoints: [],
    },
    configurations: {
      production: {
        optimization: true,
        extractLicenses: true,
        inspect: false,
      },
      development: {},
    },
  };
  updateProjectConfiguration(tree, names(options.name).fileName, projectConfig);
};
