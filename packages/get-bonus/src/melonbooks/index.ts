import type { Detail, SearchResult, SearchOptions, DetailItem } from '../types';

import { JSDOM } from 'jsdom';
import { ofetch } from 'ofetch';

import { Provider } from '../scraper';

export class Melonbooks extends Provider {
  constructor() {
    super('melonbooks');
  }

  async search(text: string, options: SearchOptions): Promise<SearchResult[]> {
    const html: string = await ofetch('https://www.melonbooks.co.jp/search/search.php', {
      query: {
        name: text,
        'additional[]': 'pr'
      }
    });

    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const resultItems = doc.querySelectorAll('.item-list li[class^=product]');
    return [...resultItems].reduce((res: SearchResult[], item) => {
      const a = item.querySelector('.item-image > a') as HTMLAnchorElement;
      res.push({
        provider: this.id,
        title: a.title,
        url: 'https://www.melonbooks.co.jp' + a.href
      });
      return res;
    }, []);
  }

  async detail(url: string): Promise<Detail | undefined> {
    const html: string = await ofetch(url);
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const title = doc.querySelector('.page-header')?.textContent || '';
    const privItems = doc.querySelectorAll('.priv-item');
    const items = [...privItems].reduce((res: DetailItem[], item) => {
      const img = item.querySelector('.priv_img') as HTMLImageElement;
      const info = item.querySelector('.priv-item_info');
      res.push({
        image: enforceHTTPS(img.src),
        description: info?.textContent?.trim?.() || ''
      });
      return res;
    }, []);

    return {
      provider: this.id,
      title,
      url,
      items
    };
  }
}

function enforceHTTPS(url: string) {
  if (url.startsWith('//')) {
    return 'https:' + url;
  } else {
    return url;
  }
}
