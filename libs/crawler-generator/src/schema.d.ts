export enum CrawlerType {
  Browser = 'browser',
  Direct = 'direct',
  Zyte = 'zyte',
}

export interface GeneratorResourceScrapperSchema {
  name: string;
  fetch: CrawlerType;
}
