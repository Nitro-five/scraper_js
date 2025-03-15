import { CheerioResourceCrawler } from '../cheerio-crawler';
import { ResourceCrawlerConfig, ResourceCrawlerHooks } from '../abstract-crawler';
import { CheerioCrawler } from 'crawlee';
import { ZyteHttpClient } from './ZyteHttpClient';

export abstract class ZyteResourceCrawler extends CheerioResourceCrawler {
  protected override readonly crawler: CheerioCrawler;

  constructor(
    config: ResourceCrawlerConfig & { zyteApiKey: string },
    hooks?: ResourceCrawlerHooks
  ) {
    super(config, hooks);
    this.crawler = new CheerioCrawler({
      httpClient: new ZyteHttpClient(config.zyteApiKey),
      requestHandler: async (params) =>
        // this.handleRequest({ ...params, contentType: { type: 'text/html' } }),
        this.handleRequest(params),
      maxRequestsPerCrawl: this.maxRequestsPerCrawl,
    });
  }
}
