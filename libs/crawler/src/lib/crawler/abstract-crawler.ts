import { BasicCrawler } from 'crawlee';
import { CrawlerPage } from '../crawler-page/crawler-page';
import { CrawlerInitialRequest, CrawlerRequest } from '../crawler-request/crawler-request';
import { CrawlerArticle } from '../crawler-article/crawler-article';
import type { CrawlingContext, Request, RequestOptions } from '@crawlee/core';
import type { BatchAddRequestsResult } from '@crawlee/types';
import { EventEmitter } from 'node:events';
import { PageLabel } from '../../common';
import { Sitemap } from 'crawlee';
import { createLogger } from '@universal-scrapper/logger';

export type ResourceCrawlerConfig = {
  maxRequestsPerCrawl: number;
  initialRequests: CrawlerInitialRequest[];
};

export type ResourceCrawlerHooks = Partial<{
  onPageLoaded: (page: CrawlerPage, request: CrawlerRequest) => Promise<void> | void;
  onPagePrepared: (page: CrawlerPage, request: CrawlerRequest) => Promise<void> | void;
  onRequestsExtracted: (pages: CrawlerRequest[] | EnqueueResult) => Promise<void> | void;
  onArticlesExtracted: (articles: CrawlerArticle[]) => Promise<void> | void;
  onPageFinalized: (page: CrawlerPage, request: CrawlerRequest) => Promise<void> | void;
  onBeforeRequestSend: (req: { url: string }) => Request | RequestOptions;
}>;

export interface ResourceCrawler {
  run(): Promise<void>;
  addArticleExtractedListener(listener: (articles: CrawlerArticle[]) => Promise<void>): void;
}

type EnqueueResult = BatchAddRequestsResult;

export const areRequestsExtracted = (
  requests: CrawlerRequest[] | EnqueueResult
): requests is CrawlerRequest[] => Array.isArray(requests);

export abstract class AbstractResourceCrawler<Context extends CrawlingContext>
  implements ResourceCrawler
{
  protected readonly logger = createLogger(this.constructor.name);
  private readonly initialRequests: CrawlerInitialRequest[];
  protected readonly maxRequestsPerCrawl: number;
  protected abstract readonly crawler: BasicCrawler<Context>;

  protected readonly onPageLoaded: ResourceCrawlerHooks['onPageLoaded'];
  protected readonly onPagePrepared: ResourceCrawlerHooks['onPagePrepared'];
  protected readonly onRequestsExtracted: ResourceCrawlerHooks['onRequestsExtracted'];
  protected readonly onPageFinalized: ResourceCrawlerHooks['onPageFinalized'];

  private readonly onBeforeRequestSend?: (req: { url: string }) => Request | RequestOptions;
  private readonly articleExtractedEventEmitter = new EventEmitter();

  constructor(
    { initialRequests, maxRequestsPerCrawl }: ResourceCrawlerConfig,
    hooks: ResourceCrawlerHooks = {}
  ) {
    this.initialRequests = initialRequests ?? [];
    this.maxRequestsPerCrawl = maxRequestsPerCrawl;

    this.onPageLoaded = hooks.onPageLoaded;
    this.onPagePrepared = hooks.onPagePrepared;
    this.onRequestsExtracted = hooks.onRequestsExtracted;

    if (hooks.onArticlesExtracted) {
      this.addArticleExtractedListener(hooks.onArticlesExtracted);
    }

    this.onPageFinalized = hooks.onPageFinalized;
    if (hooks.onBeforeRequestSend) {
      this.onBeforeRequestSend = hooks.onBeforeRequestSend;
    }
  }

  public async run() {
    const simpleUrls = this.initialRequests.filter((req) => 'url' in req);
    const sitemapUrls = this.initialRequests.filter((req) => 'sitemap' in req);

    const urlsFromSitemaps = await this.fetchUrlsFromSitemap(sitemapUrls);

    await this.crawler.run(
      [...simpleUrls, ...urlsFromSitemaps].map((request) => this.enhanceRequest(request))
    );
  }

  protected async fetchUrlsFromSitemap(
    sitemapInitialRequests: { sitemap: string }[]
  ): Promise<Array<CrawlerInitialRequest>> {
    this.logger.info('Fetch initial requests from sitemaps', {
      sitemaps: sitemapInitialRequests.map(({ sitemap }) => sitemap),
    });
    const sitemaps = await Sitemap.load(sitemapInitialRequests.map(({ sitemap }) => sitemap));
    this.logger.info(`${sitemaps.urls.length} urls fetched from sitemap`);
    return sitemaps.urls.map<CrawlerInitialRequest>((url) => ({ url, label: PageLabel.Article }));
  }

  public addArticleExtractedListener(listener: (articles: CrawlerArticle[]) => unknown) {
    this.articleExtractedEventEmitter.on('articles', listener);
  }

  public emitArticleExtractedListener(articles: CrawlerArticle[]) {
    this.articleExtractedEventEmitter.emit('articles', articles);
  }

  public async preparePage(_page: CrawlerPage, _request: CrawlerRequest): Promise<void> {
    return;
  }

  public async finalizePage(_page: CrawlerPage, _request: CrawlerRequest): Promise<void> {
    return;
  }

  protected abstract extractRequests(params: {
    page: CrawlerPage;
    request: CrawlerRequest;
    // Calling enqueueLinks leverages crawlee's feature to extract link on current page and add them into links queue to be crawled
    // Read more on topic: https://crawlee.dev/docs/examples/crawl-relative-links
    enqueueLinks: CrawlingContext['enqueueLinks'];
  }): Promise<CrawlerRequest[] | EnqueueResult>;

  protected abstract extractArticles(
    page: CrawlerPage,
    request: CrawlerRequest
  ): Promise<CrawlerArticle[]>;

  private enhanceRequest(req: CrawlerInitialRequest): Request | RequestOptions {
    if ('sitemap' in req) return { url: req.sitemap };

    if (!this.onBeforeRequestSend) {
      return req;
    }
    return this.onBeforeRequestSend(req);
  }

  protected onArticlesExtracted(articles: CrawlerArticle[]): Promise<void> | void {
    this.emitArticleExtractedListener(articles);
  }
}
