import { CrawlerElement } from '@universal-scrapper/crawler';

export const GENRE = 'news';
export const EXCLUDED_HEADLINES = [
  'Sportsbook',
  'Betting Sites',
  'Promo Code',
  'Betting Strategies',
  'Betting Guide',
  'Betting on College',
  'Guide to Betting',
  'How to Read',
];
export const REPLACEMENTS: [string, string][] = [
  ['<%= fileName %>.com', 'our website'],
  ['CBS/Paramount+', 'our website'],
  ['CBS sporting', 'sporting'],
  ['CBS Sports', 'expert'],
  ['CBS', 'our website'],
  ['Paramount+', 'our website'],
  ['Paramount', 'our website'],
  ['SportsLine', 'our website'],
];

export const QUERIES_TO_REMOVE = [
  '.native-story-ad',
  '.element-to-follow',
  '.MediaShortcode-content',
  '.MediaShortcodeYoutube-Video',
  '.PlayerSnippet',
];
export const PREDEFINED_KEYWORDS = [
  'aaf',
  'boxing',
  'wsop',
  'general',
  'mlb',
  'mma',
  'nba',
  'nfl',
  'nhl',
  'tennis',
  'news',
  'football',
  'cricket',
  'baseball',
  'basketball',
  'boxer',
  'bet',
  'betting',
  'international',
  'game',
  'season',
  'historic',
  'professional',
  'environment',
  'junior',
  'tournament',
  'season',
  'fans',
  'victory',
  'record',
  'dominant',
  'win',
  'leagues',
  'poker',
  'cards',
  'croupier',
  'world cup',
  'horses',
  'horse racing',
];
export const generateKeywords = (text: string) => {
  text = text.toLocaleLowerCase();
  return PREDEFINED_KEYWORDS.filter((word) => text.includes(word));
};

export const replaceKeywords = (s: string) =>
  REPLACEMENTS.reduce((acc, args) => acc.replaceAll(...args), s);

export const removeHtmlByQueries = async (body: CrawlerElement, queries: string[]) => {
  let html = await body.outerHTML();
  for (const query of queries) {
    const elemToRemove = await body.querySelector(query);
    const htmlToRemove = await elemToRemove?.innerHTML();
    if (htmlToRemove && html) html = html?.replaceAll(htmlToRemove, '');
  }
  return html;
};
