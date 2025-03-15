import { PlaywrightElementFacade } from '../crawler-element/playwright-crawler-element';
import { CrawlerPage } from './crawler-page';

export class PlaywrightPageFacade extends PlaywrightElementFacade implements CrawlerPage {}
