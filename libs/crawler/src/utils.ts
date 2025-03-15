import { CrawlerPage } from './lib/crawler-page/crawler-page';
import { CrawlerRequest } from './lib/crawler-request/crawler-request';
import iso639 from 'iso-639-1';
import * as chrono from 'chrono-node';

const fallbackLang = 'en';

export const getPageLanguage = async (
  page: CrawlerPage,
  request: CrawlerRequest
): Promise<string> => {
  const htmlLang = await page.getAttribute('lang');
  if (htmlLang) {
    return htmlLang;
  }
  try {
    const url = new URL(request.loadedUrl);
    const urlLangCode = url.pathname.split('/')[1];
    const language = iso639.getLanguages([urlLangCode])[0];
    if (language?.name) {
      return language.code;
    }
  } catch (e) {
    /* empty */
  }
  return fallbackLang;
};

/**
 *
 * @param dateString
 * @return date in ISO format or null if it can't be parsed
 */
export const parseToISODate = (dateString: string | null | undefined): string | undefined => {
  if (!dateString) {
    return;
  }
  const parsed = chrono.parseDate(dateString, { timezone: process.env.TZ });
  return parsed?.toISOString();
};
