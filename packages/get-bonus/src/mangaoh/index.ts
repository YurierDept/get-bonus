import type { Detail, SearchResult, SearchOptions } from '../types';

import { JSDOM } from 'jsdom';
import { ofetch } from 'ofetch';

import { Provider } from '../scraper';

export class Mangaoh extends Provider {
  constructor() {
    super('mangaoh', 'https://www.mangaoh.co.jp');
  }

  async search(text: string, options: Partial<SearchOptions>): Promise<SearchResult[]> {
    const html = await ofetch(this.baseUrl + '/search', {
      query: {
        q: text + ' +特典'
      }
    });

    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const resultItems = doc.querySelectorAll('.result-card');
    return [...resultItems].map((item) => {
      const a = item.querySelector('.prd_name') as HTMLAnchorElement;
      return {
        provider: this.id,
        title: a.textContent?.trim?.() || '',
        url: this.baseUrl + a.href
      };
    });
  }

  async detail(url: string): Promise<Detail | undefined> {
    const html = await ofetch(url);
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const title = doc.querySelector('.product-name');
    const imgs = doc.querySelectorAll('.thickbox > img');
    const descs = doc
      .querySelector('.thickbox:last-of-type')
      ?.nextElementSibling?.textContent?.split?.('+');

    const items = [...imgs].map((img, i) => ({
      image: (img as HTMLImageElement).src,
      description: descs?.[i] || ''
    }));

    return {
      provider: this.id,
      title: title?.textContent?.trim() || '',
      url,
      items
    };
  }
}
