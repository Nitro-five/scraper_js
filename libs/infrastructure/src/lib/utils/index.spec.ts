import { getUrnForUrl } from './index';

describe('utils', () => {
  describe('getUrnForUrl', () => {
    it.each([
      {
        url: 'https://wWw.Dw.cOm/eN/toP-stOries/S-9097',
        urn: 'urn:usj:dw.com:/en/top-stories/s-9097',
      },
      {
        url: 'https://www.dw.com/en/top-stories/s-9097',
        urn: 'urn:usj:dw.com:/en/top-stories/s-9097',
      },
      {
        url: 'https://www.dw.com/en/nigeria-marks-detty-december-amid-economic-woes/video-71158848?queryParam=value#hash-value',
        urn: 'urn:usj:dw.com:/en/nigeria-marks-detty-december-amid-economic-woes/video-71158848',
      },
      {
        url: 'https://www.dw.com/en/top-stories/s-9097/',
        urn: 'urn:usj:dw.com:/en/top-stories/s-9097',
      },
    ])('should convert url to urn', ({ url, urn }) => {
      expect(getUrnForUrl(url)).toEqual(urn);
    });
  });
});
