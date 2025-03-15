import { Request, Dictionary, LoadedRequest } from 'crawlee';

// TODO: write wrappers for playwright and cheerio parsers
export type CrawlerRequest = LoadedRequest<LoadedRequest<Request<Dictionary>>>;

export type CrawlerInitialRequest =
  | {
      url: string;
      label?: string;
    }
  | { sitemap: string };
