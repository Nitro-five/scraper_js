import {
  CrawlerArticle,
  CrawlerElement,
  CrawlerPage,
  CrawlerRequest,
  CrawlerInitialRequest,
  getPageLanguage,
  PageLabel,
  ZyteResourceCrawler,
  parseToISODate,
} from '@universal-scrapper/crawler';
import type { CrawlingContext } from '@crawlee/core';
import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio';

import { ImageAssociationSchema, getUrnForUrl, hash } from '@universal-scrapper/infrastructure';
import {
  EXCLUDED_HEADLINES,
  generateKeywords,
  GENRE,
  QUERIES_TO_REMOVE,
  removeHtmlByQueries,
  replaceKeywords,
} from './utils';

export const initialRequests: CrawlerInitialRequest[] = [
  { sitemap: 'https://www.casinocitytimes.com/sitemap.xml' },
];

export class CasinocityCrawler extends ZyteResourceCrawler {
  private readonly articleQueries = [
    '.Article-bodyContent',
    '.article-content',
    '#content',
    '.block-core',
  ];
  private readonly zyteApiKey: string;

  constructor() {
    const apiKey = process.env.ZYTE_API_KEY;
    if (!apiKey) {
      throw new Error('ZYTE_API_KEY не задан в переменных окружения');
    }
    super({
      zyteApiKey: apiKey,
      maxRequestsPerCrawl: 50,
      initialRequests,
    });
    this.zyteApiKey = apiKey;
  }

  private cleanText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  async extractRequests({ page, request, enqueueLinks }: { page: CrawlerPage; request: CrawlerRequest; enqueueLinks: Function }): Promise<any> {
    return await enqueueLinks({
      strategy: 'all',
      selector: 'td#mainCol a.noUL.title, div.articleBlock a.noUL.title, h2 a.noUL',
      label: PageLabel.Article,
    });
  }

  private async extractArticle(page: CrawlerPage): Promise<{ html: string; text: string } | null> {
    const articleElement = await page.querySelector('td#mainCol');
    if (articleElement) {
      const html = (await articleElement.innerHTML()) ?? '';
      const text = await articleElement.innerText() ?? '';
      return { html, text: this.cleanText(text) };
    }
    return null;
  }

  private async getArticleDate(page: CrawlerPage): Promise<string> {
    const dateText = await page.querySelector('span.date')?.then((e) => e?.innerText() ?? '') ?? '';
    return parseToISODate(dateText.trim()) ?? new Date().toISOString();
  }

  private async getHeadline(page: CrawlerPage): Promise<string> {
    return (await page.querySelector('.Article-headline')?.then((e) => e?.innerText() ?? '') ?? '').trim();
  }

  private async getTeaser(page: CrawlerPage): Promise<string> {
    return (await page.querySelector('.Article-subline')?.then((e) => e?.innerText() ?? '') ?? '').trim();
  }

  async extractArticles(page: CrawlerPage, request: CrawlerRequest): Promise<CrawlerArticle[]> {
    const articles: CrawlerArticle[] = [];
    const articleData = await this.extractArticle(page);
    if (!articleData) {
      this.logger.info(`No article found for ${request.url}`);
      return [];
    }

    const { html, text } = articleData;
    const headline = await this.getHeadline(page);
    const teaser = await this.getTeaser(page);
    const parsedDate = await this.getArticleDate(page);

    articles.push({
      digitalwires: {
        headline,
        teaser,
        dateline: parsedDate,
        version_created: parsedDate,
        updated: parsedDate,
        article_html: html,
        pubstatus: 'usable',
        creditline: request.url,
        urn: getUrnForUrl(request.url),
        language: (await getPageLanguage(page, request)) ?? 'en',
        associations: [],
        categories: [],
        current_rubric_names: [request.url],
        rubric_names: [request.url],
        descriptions: [
          { role: 'title', description: headline },
          { role: 'description', description: teaser },
        ],
        genre_names: [GENRE],
        keyword_names: [],
        version: 1,
      },
      asb_meta: {
        debugging_meta: {
          urn: getUrnForUrl(request.url),
          creditline: request.url,
          headline,
          source_article_url: request.url,
        },
      },
    });
    return articles;
  }
}
