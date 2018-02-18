import validUrl from 'valid-url';

const faviconFetch = 'https://www.google.com/s2/favicons?domain=';
const defaultFaviconUrl = 'https://www.google.com';

const getFavicon = (url) => {
  const faviconUrl = validUrl.isWebUri(url) ? url : defaultFaviconUrl;
  return faviconFetch + faviconUrl;
};

module.exports = getFavicon;
