import type { Detail, SearchResult, SearchOptions, DetailItem } from '../types';

import { JSDOM } from 'jsdom';
import { ofetch } from 'ofetch';

import { Provider } from '../scraper';

export class Animate extends Provider {
  constructor() {
    super('animate', 'https://www.animate-onlineshop.jp');
  }

  async search(text: string, options: Partial<SearchOptions>): Promise<SearchResult[]> {
    const html = await ofetch(this.baseUrl + '/products/list.php', {
      query: {
        mode: 'search',
        smt: text,
        spc: 4 // 書籍
      }
    });

    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const resultItems = doc.querySelectorAll('.main_contents .item_list > ul > li');

    return [...resultItems].map((item) => {
      const titleNode = item.querySelector('h3 > a') as HTMLAnchorElement;
      const title = titleNode?.textContent?.trim() ?? '';
      const url = titleNode?.href ?? '';

      return {
        provider: this.id,
        title,
        url: this.baseUrl + url
      };
    });
  }

  async detail(url: string): Promise<Detail | undefined> {
    const html = await ofetch(url);
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const main = doc.querySelector('.main_contents');
    if (!main) return undefined;

    const title = main.querySelector('.item_overview_detail > h1')?.textContent?.trim() ?? '';
    const date = resolveDate(main.querySelector('.item_status .release .num')?.textContent?.trim());
    const price = resolvePrice(main.querySelector('.item_price .price')?.textContent?.trim());

    const items = [...doc.querySelectorAll('.item_benefit .detail')].map((node) => {
      const image = node.querySelector('.image img') as HTMLImageElement;
      const description = node.querySelector('.text')?.textContent?.trim() ?? '';

      return {
        image: image.src,
        description
      };
    });

    return {
      provider: this.id,
      title,
      url,
      date,
      price,
      items
    };
  }
}

/**
 * 990円(税込)
 */
function resolvePrice(t?: string) {
  if (!t) return undefined;
  const match = /([0-9,]+)/.exec(t);
  return match ? +match[1].replace(/,/g, '') : undefined;
}

/**
 * 2023/09/27 発売
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
