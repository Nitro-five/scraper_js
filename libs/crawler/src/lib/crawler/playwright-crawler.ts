import { PlaywrightCrawlingContext, PlaywrightCrawler } from 'crawlee';
import { ElementHandle } from 'playwright';
import { AbstractResourceCrawler, areRequestsExtracted } from './abstract-crawler';
import { PlaywrightPageFacade } from '../crawler-page/playwright-page-facade';

export abstract class PlaywrightResourceCrawler extends AbstractResourceCrawler<PlaywrightCrawlingContext> {
  protected crawler = new PlaywrightCrawler({
    requestHandler: async ({ page, request, enqueueLinks, addRequests }) => {
      const html = (await page.$('html')) as ElementHandle<HTMLElement>;
      const pageFacade = new PlaywrightPageFacade(html);

      await this.onPageLoaded?.(pageFacade, request);

      await this.preparePage(pageFacade, request);
      await this.onPagePrepared?.(pageFacade, request);

      const requests = await this.extractRequests({ page: pageFacade, request, enqueueLinks });
      if (areRequestsExtracted(requests)) {
        await addRequests(requests);
      }
      await this.onRequestsExtracted?.(requests);

      const articles = await this.extractArticles(pageFacade, request);
      await this.onArticlesExtracted?.(articles);

      await this.finalizePage(pageFacade, request);
      await this.onPageFinalized?.(pageFacade, request);
    },
    maxRequestsPerCrawl: this.maxRequestsPerCrawl,
  });
}
