import { createHash } from 'node:crypto';

const www_prefix = 'www.';
export const getUrnForUrl = (urlRaw: string): string => {
  let url: URL;
  try {
    url = new URL(urlRaw.toLowerCase());
  } catch (e) {
    throw new Error(`"${urlRaw}" malformed url can't be converted to urn`);
  }
  const hostname = url.hostname.startsWith(www_prefix)
    ? url.hostname.substring(www_prefix.length)
    : url.hostname;

  const pathname = url.pathname.endsWith('/')
    ? url.pathname.substring(0, url.pathname.length - 1)
    : url.pathname;
  // ADHOC: "USJ" stands for Unified Scrapper Js
  return `urn:usj:${hostname}:${pathname}`;
};

export const hash = (value: string): string => createHash('sha1').update(value).digest('hex');
