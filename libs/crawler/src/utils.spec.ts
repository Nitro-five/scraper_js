import { getPageLanguage } from './utils';
import { CrawlerPage } from './lib/crawler-page/crawler-page';
import { CrawlerRequest } from './lib/crawler-request/crawler-request';
import { instance, mock, reset, when } from 'ts-mockito';

describe('utils', () => {
  describe('getPageLanguage', () => {
    const page = mock<CrawlerPage>();
    const request = mock<CrawlerRequest>();

    afterEach(() => reset<CrawlerPage | CrawlerRequest>(page, request));

    describe('with page html lang attribute', () => {
      it("should detect language from html tag's lang attribute", async () => {
        // arrange
        when(page.getAttribute('lang')).thenResolve('it');
        // act
        const result = await getPageLanguage(instance(page), instance(request));
        // assert
        expect(result).toEqual('it');
      });
    });

    describe('without page html lang attribute', () => {
      it('should detect language from url', async () => {
        // arrange
        when(request.loadedUrl).thenReturn('https://newsportal.test/de/some-article-headline');
        // act
        const result = await getPageLanguage(instance(page), instance(request));
        // assert
        expect(result).toEqual('de');
      });

      it('should return fallback language if url contains wrong/missing language code', async () => {
        // arrange
        when(request.loadedUrl).thenReturn('https://newsportal.test/some-article-headline');
        // act
        const result = await getPageLanguage(instance(page), instance(request));
        // assert
        expect(result).toEqual('en');
      });
    });
  });
});
