import 'dotenv/config';
import { AbstractResourceCrawler } from './crawler/abstract-crawler';
import { BasicCrawler, CrawlingContext, Dictionary } from 'crawlee';
import { CrawlerInitialRequest } from './crawler-request/crawler-request';

const testFetchUrlsFromSitemap = jest.fn<Promise<CrawlerInitialRequest[]>, [{ sitemap: string }[]]>(
  () => Promise.resolve([])
);

class ResourceCrawler extends AbstractResourceCrawler<CrawlingContext> {
  protected override fetchUrlsFromSitemap = testFetchUrlsFromSitemap;
  protected override crawler: BasicCrawler<CrawlingContext<unknown, Dictionary>> =
    new BasicCrawler();
  protected override extractRequests = jest.fn();
  protected override extractArticles = jest.fn();
}

const initialRequests = [{ sitemap: 'https://www.dw.com/sitemap.xml' }];

describe('ResourceCrawler', () => {
  it('should call sitemap fetch', async () => {
    const crawler = new ResourceCrawler({ initialRequests, maxRequestsPerCrawl: 5 });
    await crawler.run();

    expect(testFetchUrlsFromSitemap).toHaveBeenCalledWith(initialRequests);
  });
});
