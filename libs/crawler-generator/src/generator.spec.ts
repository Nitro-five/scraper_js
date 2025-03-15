import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { GeneratorResourceScrapper } from './generator';
import { CrawlerType, GeneratorResourceScrapperSchema } from './schema';

describe('libs/crawler-generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  describe('zyte', () => {
    it('should generate successfully', async () => {
      // arrange
      const options: GeneratorResourceScrapperSchema = {
        name: 'test',
        fetch: 'zyte' as CrawlerType,
      };
      // act
      await GeneratorResourceScrapper(tree, options);
      const config = readProjectConfiguration(tree, 'test');
      // assert
      expect(config).toMatchSnapshot();
      expect(tree.read('apps/test/src/test-crawler.spec.ts', 'utf-8')).toMatchSnapshot();
      expect(tree.read('apps/test/src/test-crawler.ts', 'utf-8')).toMatchSnapshot();
      expect(tree.read('apps/test/src/main.ts', 'utf-8')).toMatchSnapshot();
    });
  });
});
