import type { Detail, SearchResult, SearchOptions, DetailItem } from '../types';

import { JSDOM } from 'jsdom';
import { ofetch } from 'ofetch';

import { Provider } from '../scraper';

export class Toranoana extends Provider {
  constructor() {
    super('toranoana', 'https://ecs.toranoana.jp');
  }

  async search(text: string, options: SearchOptions): Promise<SearchResult[]> {
    const html = await ofetch(this.baseUrl + '/tora/ec/app/catalog/list', {
      query: {
        searchWord: text,
        stock_status: '○,△'
        // commodity_kind_name: '特典'
      }
    });

    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const resultItems = doc.querySelectorAll('.product-list-item');
    return [...resultItems].map((item) => {
      const a = item.querySelector('.product-list-title > a') as HTMLAnchorElement;
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

    const title = doc.querySelector('.product-detail-desc-title')?.textContent || '';
    const items: DetailItem[] = [];

    const img = doc.querySelector('.product-detail-image-main img') as HTMLImageElement;
    items.push({
      image: img.src,
      description: title
    });

    return {
      provider: this.id,
      title,
      url,
      items
    };
  }
}
