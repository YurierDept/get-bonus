import type { Detail, SearchResult, SearchOptions } from '../types';

import { JSDOM } from 'jsdom';
import { ofetch } from 'ofetch';

import { Provider } from '../scraper';

export class Gamers extends Provider {
  constructor() {
    super('gamers', 'https://www.gamers.co.jp');
  }

  async search(text: string, options: Partial<SearchOptions>): Promise<SearchResult[]> {
    const html = await ofetch(this.baseUrl + '/products/list.php', {
      query: {
        smt: text,
        spc: 4,
        'nd[]': [5, 6]
      }
    });

    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const resultItems = doc.querySelectorAll('.list_product > a');
    return [...resultItems].map((item) => {
      const title = item.querySelector('.item_list_ttl');
      return {
        provider: this.id,
        title: title?.textContent?.trim?.() || '',
        url: this.baseUrl + (item as HTMLAnchorElement).href
      };
    });
  }

  async detail(url: string): Promise<Detail | undefined> {
    const html = await ofetch(url);
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const title = doc.querySelector('.ttl_style01');
    const tokutens = doc.querySelectorAll('#tokuten > div[class]');
    const items = [...tokutens].map((item) => {
      const img = item.querySelector('img') as HTMLImageElement;
      const info = item.querySelector('.tokuten_name');
      return {
        image: img.src,
        description: info?.textContent || ''
      };
    });

    return {
      provider: this.id,
      title: title?.textContent?.trim?.() || '',
      url,
      items
    };
  }
}
