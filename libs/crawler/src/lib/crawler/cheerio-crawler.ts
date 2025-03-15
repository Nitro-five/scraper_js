import { CheerioCrawler, CheerioCrawlingContext, LoadedRequest } from 'crawlee';
import { AbstractResourceCrawler, areRequestsExtracted } from './abstract-crawler';
import { CheerioPageFacade } from '../crawler-page/cheerio-page-facade';
import { CheerioAPI } from 'cheerio';
import { RestrictedCrawlingContext } from '@crawlee/core/crawlers/crawler_commons';

export abstract class CheerioResourceCrawler extends AbstractResourceCrawler<CheerioCrawlingContext> {
  protected readonly crawler = new CheerioCrawler({
    requestHandler: async (params) => this.handleRequest(params),
    maxRequestsPerCrawl: this.maxRequestsPerCrawl,
  });

  protected async handleRequest({
    $,
    request,
    addRequests,
    enqueueLinks,
  }: {
    $: CheerioAPI;
    request: LoadedRequest<CheerioCrawlingContext['request']>;
    addRequests: RestrictedCrawlingContext['addRequests'];
    enqueueLinks: CheerioCrawlingContext['enqueueLinks'];
  }) {
    const html = $('html');
    const pageFacade = new CheerioPageFacade(html, $);

    await this.onPageLoaded?.(pageFacade, request);

    await this.preparePage(pageFacade, request);
    await this.onPagePrepared?.(pageFacade, request);

    const requests = await this.extractRequests({ page: pageFacade, request, enqueueLinks });
    if (areRequestsExtracted(requests)) {
      await addRequests(requests);
    }
    await this.onRequestsExtracted?.(requests);

    const articles = await this.extractArticles(pageFacade, request);
    await this.onArticlesExtracted(articles);

    await this.finalizePage(pageFacade, request);
    await this.onPageFinalized?.(pageFacade, request);
  }
}
