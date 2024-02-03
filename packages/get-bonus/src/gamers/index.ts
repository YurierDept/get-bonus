import type { Detail, SearchResult, SearchOptions, DetailItem } from '../types';

import { JSDOM } from 'jsdom';
import { ofetch } from 'ofetch';

import { Provider } from '../scraper';
import { removeExtraSpaces } from '../utils';

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

    const price = resolvePrice(doc.querySelector('.item_detail_price .price')?.textContent?.trim());
    const date = resolveDate(
      doc.querySelector('.item_detail_release .release')?.textContent?.trim()
    );

    const tokutens = doc.querySelectorAll('#tokuten > div[class]');
    const items = [...tokutens].map((item) => {
      const img = item.querySelector('img') as HTMLImageElement;
      const info = item.querySelector('.tokuten_name');
      return <DetailItem>{
        image: img.src,
        description: removeExtraSpaces(info?.textContent || '')
      };
    });

    return {
      provider: this.id,
      title: title?.textContent?.trim?.() || '',
      date,
      price,
      url,
      items
    };
  }
}

/**
 * Pattern: `2023/09/27`
 */
function resolveDate(t?: string) {
  if (!t) return undefined;
  const RE = /(\d+)\/(\d+)\/(\d+)/;
  const match = RE.exec(t);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return undefined;
}

/**
 * Pattern: `990Yen（tax included）`
 */
function resolvePrice(t?: string) {
  if (!t) return undefined;
  const match = /([0-9,]+)/.exec(t);
  return match ? +match[1].replace(/,/g, '') : undefined;
}
