import { Cheerio, CheerioAPI, Element } from 'cheerio';
import { CrawlerElement } from './crawler-element';

export class CheerioElementFacade implements CrawlerElement {
  constructor(private element: Cheerio<Element>, private $: CheerioAPI) {}

  async getTagName(): Promise<string> {
    return this.element.prop('tagName');
  }

  async getAttribute(name: string): Promise<string | null> {
    return this.element.attr(name) || null;
  }

  async textContent(): Promise<string | null> {
    return this.element.prop('textContent');
  }

  async innerHTML(): Promise<string | null> {
    return this.element.prop('innerHTML');
  }

  async querySelector(selector: string): Promise<CrawlerElement | null> {
    const element = this.element.find(selector)[0];
    return element ? new CheerioElementFacade(this.$(element), this.$) : null;
  }

  async querySelectorAll(selector: string): Promise<CrawlerElement[]> {
    return [...this.element.find(selector)].map(
      (elem) => new CheerioElementFacade(this.$(elem), this.$)
    );
  }

  async innerText(): Promise<string | null> {
    return this.element.prop('innerText');
  }

  async outerHTML(): Promise<string | null> {
    return this.element.prop('outerHTML');
  }

  async getAttributes(): Promise<Record<string, string>> {
    return this.element.attr() || {};
  }

  async children(): Promise<CrawlerElement[]> {
    return [...this.element.children()].map(
      (child) => new CheerioElementFacade(this.$(child), this.$)
    );
  }

  async remove(): Promise<void> {
    this.element.remove();
  }
}
