# crawler

Provides implementations for Cheerio and Playwright-based crawlers with a shared interface for flexible data extraction.

## Core Components

### AbstractResourceCrawler

- Abstract base for resource crawlers, with hooks for page processing.
- Hooks:
  - `onPageLoaded`, `onPagePrepared`, `onRequestsExtracted`, `onArticlesExtracted`, `onPageFinalized`.
- Methods:
  - `run()`: Starts the crawler.
  - `preparePage()`: Prepares a page before processing.
  - `finalizePage()`: Cleans up after page processing.
  - `extractRequests()`, `extractArticles()`: Methods for request and article extraction.

### CrawlerPage & CrawlerElement Facades

- **CrawlerElement**: Provides a consistent interface for interacting with Cheerio and Playwright elements.
  - Methods: `getTagName()`, `getAttribute()`, `textContent()`, `querySelector()`, etc.
- **CrawlerPage**: Extends `CrawlerElement`, reserving future page-level functionality.

### Types

- `CrawlerRequest` / `CrawlerInitialRequest`: Define structure for requests.
- `CrawlerArticle`: Type alias for `DigitalWires`, representing structured article data.

## Building

Run `nx build crawler` to build the library.

## Running unit tests

Run `nx test crawler` to execute the unit tests via [Jest](https://jestjs.io).
