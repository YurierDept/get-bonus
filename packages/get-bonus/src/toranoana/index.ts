import type { Detail, SearchResult, SearchOptions, DetailItem } from '../types';

import { JSDOM } from 'jsdom';
import { ofetch } from 'ofetch';

import { Provider } from '../scraper';

export class Toranoana extends Provider {
  constructor() {
    super('toranoana', 'https://ecs.toranoana.jp');
  }

  async search(text: string, options: Partial<SearchOptions>): Promise<SearchResult[]> {
    const html = await ofetch(this.baseUrl + '/tora/ec/app/catalog/list', {
      query: {
        searchWord: text,
        stock_status: '○,△',
        commodity_kind_name: '書籍'
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
    const price = resolvePrice(
      doc.querySelector('li.pricearea__price--normal:nth-child(1)')?.textContent?.trim()
    );
    const date = resolveDate(
      doc
        .querySelector(
          '.product-detail-spec-table > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2) > a:nth-child(1) > span:nth-child(1)'
        )
        ?.textContent?.trim()
    );
    const items: DetailItem[] = [];

    const img = doc.querySelector('.product-detail-image-main img') as HTMLImageElement;
    items.push({
      image: img.src,
      description: title
    });

    return {
      provider: this.id,
      title,
      date,
      price,
      url,
      items
    };
  }
}

/**
 * Pattern: `2023/09/27 発売 `
 */
function resolveDate(t?: string) {
  if (!t) return undefined;
  const RE = /(\d+)\/(\d+)\/(\d+)/;
  const match = RE.exec('tora:' + t);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return undefined;
}

/**
 * Pattern: `990円(税込)`
 */
function resolvePrice(t?: string) {
  if (!t) return undefined;
  const match = /([0-9,]+)/.exec(t);
  return match ? +match[1].replace(/,/g, '') : undefined;
}
