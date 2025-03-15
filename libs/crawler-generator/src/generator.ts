import {
  formatFiles,
  generateFiles,
  installPackagesTask,
  names,
  OverwriteStrategy,
  Tree,
} from '@nx/devkit';
import { applicationGenerator } from '@nx/node';
import { join } from 'path';
import { GeneratorResourceScrapperSchema } from './schema';
import { defineWebpackBuildTarget } from './defineWebpackBuildTarget';

export async function GeneratorResourceScrapper(
  tree: Tree,
  options: GeneratorResourceScrapperSchema
) {
  if (options.fetch !== 'zyte') {
    throw new Error(`Only "zyte" fetch type is currently supported.`);
  }

  const projectRoot = `apps/${names(options.name).fileName}`;
  const projectRootSrc = `${projectRoot}/src`;
  const projectSrc = join(__dirname, 'templates', String(options.fetch));

  await applicationGenerator(tree, {
    directory: projectRoot,
    name: options.name,
    e2eTestRunner: 'none',
    bundler: 'webpack',
  });

  tree.delete(projectRootSrc);

  generateFiles(
    tree,
    projectSrc,
    projectRootSrc,
    { ...options, tmpl: '', ...names(options.name) },
    {
      overwriteStrategy: OverwriteStrategy.ThrowIfExisting,
    }
  );
  defineWebpackBuildTarget(options, tree);

  await formatFiles(tree);

  return () => installPackagesTask(tree);
}

export default GeneratorResourceScrapper;
