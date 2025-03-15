import { ElementHandle } from 'playwright';
import { CrawlerElement } from './crawler-element';

export class PlaywrightElementFacade implements CrawlerElement {
  constructor(private element: ElementHandle<SVGElement | HTMLElement>) {}

  async getTagName(): Promise<string> {
    return await this.element.evaluate((el) => el.tagName.toLowerCase());
  }

  async getAttribute(name: string): Promise<string | null> {
    return await this.element.getAttribute(name);
  }

  async textContent(): Promise<string | null> {
    return await this.element.textContent();
  }

  async innerHTML(): Promise<string | null> {
    return await this.element.evaluate((el) => el.innerHTML);
  }

  async querySelector(selector: string): Promise<CrawlerElement | null> {
    const element = await this.element.$(selector);
    return element ? new PlaywrightElementFacade(element) : null;
  }

  async querySelectorAll(selector: string): Promise<CrawlerElement[]> {
    const elements = await this.element.$$(selector);
    return elements.map((el) => new PlaywrightElementFacade(el));
  }

  async innerText(): Promise<string | null> {
    return await this.element.innerText();
  }

  async outerHTML(): Promise<string | null> {
    return await this.element.evaluate((el) => el.outerHTML);
  }

  async getAttributes(): Promise<Record<string, string>> {
    return Object.fromEntries(
      await this.element
        .evaluate((el) => Array.from(el.attributes).map((attr) => attr.name))
        .then(
          async (attributeNames) =>
            await Promise.all(
              attributeNames.map(async (attributeName) => [
                attributeName,
                await this.element.getAttribute(attributeName),
              ])
            )
        )
        .then((entries) => entries.filter(([key, value]) => typeof value === 'string'))
    );
  }

  async remove(): Promise<void> {
    await this.element.evaluate((el) => el.remove());
  }

  async children(): Promise<CrawlerElement[]> {
    const childrenHandles = await this.element.evaluateHandle((el) => Array.from(el.children));
    const childrenElements = await childrenHandles.getProperties();

    return Array.from(childrenElements.values())
      .map((child) => child.asElement())
      .filter((child) => !!child)
      .map((child) => new PlaywrightElementFacade(child));
  }
}
