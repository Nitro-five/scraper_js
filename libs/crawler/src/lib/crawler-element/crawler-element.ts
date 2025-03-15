export interface CrawlerElement {
  getTagName(): Promise<string>;
  getAttribute(name: string): Promise<string | null>;
  getAttributes(): Promise<Record<string, string>>;
  textContent(): Promise<string | null>;
  innerText(): Promise<string | null>;
  innerHTML(): Promise<string | null>;
  outerHTML(): Promise<string | null>;
  querySelector(selector: string): Promise<CrawlerElement | null>;
  querySelectorAll(selector: string): Promise<CrawlerElement[]>;
  remove(): Promise<void>;
  children(): Promise<CrawlerElement[]>;
}
