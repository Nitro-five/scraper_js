import {
  CrawlerElement,
  CrawlerPage,
  CrawlerRequest,
  PageLabel,
} from '@universal-scrapper/crawler';
import { instance, mock, reset, when } from 'ts-mockito';
import { resolvableInstance } from '@universal-scrapper/test';
import { CasinocityCrawler } from './casinocity-crawler';

describe('CasinocityCrawler', () => {
  describe('extractArticles', () => {
    let pageMock: CrawlerPage;
    let requestMock: CrawlerRequest;

    beforeEach(() => {
      pageMock = mock<CrawlerPage>();
      requestMock = mock<CrawlerRequest>();
    });

    afterEach(() => reset<CrawlerPage | CrawlerRequest>(pageMock, requestMock));

    it('should extract article with valid metadata and content', async () => {
      const crawler = new CasinocityCrawler({
        initialRequests: [{ url: 'https://dummy' }],
        maxRequestsPerCrawl: 1,
        zyteApiKey: 'test-zyte-api-key',
      });

      when(requestMock.label).thenReturn(PageLabel.Article);
      when(pageMock.getAttribute('lang')).thenResolve('en');

      const articleContentMock = mock<CrawlerElement>();
      const titleMock = mock<CrawlerElement>();
      const teaserMock = mock<CrawlerElement>();
      const dateMock = mock<CrawlerElement>();

      when(titleMock.innerText()).thenResolve('titleMock');
      when(teaserMock.getAttribute('content')).thenResolve('teaserMock');
      when(dateMock.getAttribute('content')).thenResolve('2025-01-01T00:00:00+00:00');
      when(articleContentMock.outerHTML()).thenResolve('<div>Full article content</div>');
      when(pageMock.innerHTML()).thenResolve('<html><body>Mocked HTML Content</body></html>');

      when(pageMock.querySelector('meta[name="description"]')).thenResolve(
        resolvableInstance(teaserMock)
      );
      when(pageMock.querySelector('meta[property="article:published_time"]')).thenResolve(
        resolvableInstance(dateMock)
      );
      when(pageMock.querySelector('.head h1')).thenResolve(resolvableInstance(titleMock));
      when(pageMock.querySelector('.article-page .body')).thenResolve(
        resolvableInstance(articleContentMock)
      );
      when(requestMock.loadedUrl).thenReturn(
        'https://www.casinocity.com/news/deem-enterprises-reiterates-plan-to-redevelop-acs-defunct-bader-field-airport/'
      );
      when(requestMock.url).thenReturn(
        'https://www.casinocity.com/news/deem-enterprises-reiterates-plan-to-redevelop-acs-defunct-bader-field-airport/'
      );

      const articles = await crawler.extractArticles(instance(pageMock), instance(requestMock));

      expect(articles).toBeDefined();
      expect(articles).toMatchInlineSnapshot(`
        [
          {
            "asb_meta": {
              "debugging_meta": {
                "creditline": "https://www.casinocity.com/news/deem-enterprises-reiterates-plan-to-redevelop-acs-defunct-bader-field-airport/",
                "headline": "titleMock",
                "source_article_url": "https://www.casinocity.com/news/deem-enterprises-reiterates-plan-to-redevelop-acs-defunct-bader-field-airport/",
                "urn": "urn:usj:casinocity.com:/news/deem-enterprises-reiterates-plan-to-redevelop-acs-defunct-bader-field-airport",
              },
            },
            "digitalwires": {
              "article_html": "<div>Full article content</div>",
              "associations": [],
              "categories": [],
              "creditline": "https://www.casinocity.com/news/deem-enterprises-reiterates-plan-to-redevelop-acs-defunct-bader-field-airport/",
              "current_rubric_names": [
                "https://www.casinocity.com/news/deem-enterprises-reiterates-plan-to-redevelop-acs-defunct-bader-field-airport/",
              ],
              "dateline": "2025-01-01T00:00:00.000Z",
              "descriptions": [
                {
                  "description": "titleMock",
                  "role": "title",
                },
                {
                  "description": "teaserMock",
                  "role": "description",
                },
              ],
              "genre_names": [
                "casino",
              ],
              "headline": "titleMock",
              "keyword_names": [],
              "language": "en",
              "pubstatus": "usable",
              "rubric_names": [
                "https://www.casinocity.com/news/deem-enterprises-reiterates-plan-to-redevelop-acs-defunct-bader-field-airport/",
              ],
              "teaser": "teaserMock",
              "updated": "2025-01-01T00:00:00.000Z",
              "urn": "urn:usj:casinocity.com:/news/deem-enterprises-reiterates-plan-to-redevelop-acs-defunct-bader-field-airport",
              "version": 1,
              "version_created": "2025-01-01T00:00:00.000Z",
            },
          },
        ]
      `);
    });
  });
});
