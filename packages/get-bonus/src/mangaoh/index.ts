import type { Detail, SearchResult, SearchOptions, DetailItem } from '../types';

import { JSDOM } from 'jsdom';
import { ofetch } from 'ofetch';

import { Provider } from '../scraper';
import { removeExtraSpaces } from '../utils';

export class Mangaoh extends Provider {
  constructor() {
    super('漫画王', 'https://www.mangaoh.co.jp');
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
      ?.nextElementSibling?.textContent?.split('+');
    const rows = doc.querySelectorAll('.spec-table > tbody > tr');
    let date;
    let price;
    rows?.forEach((row) => {
      const th = row.querySelector('th');
      const td = row.querySelector('td');
      const title = th?.textContent?.trim();
      const content = td?.textContent?.trim();
      if (title === '発売日') {
        date = content;
      } else if (title === '価格') {
        price = resolvePrice(content);
      }
    });
    const items = [...imgs].map(
      (img, i) =>
        <DetailItem>{
          image: (img as HTMLImageElement).src,
          description: removeExtraSpaces(descs?.[i] || '')
        }
    );

    return {
      provider: this.id,
      title: title?.textContent?.trim() || '',
      date,
      price,
      url,
      items
    };
  }
}

/**
 * Pattern: `3,740円(本体3,400円) `
 */
function resolvePrice(t?: string) {
  t;
  if (!t) return undefined;
  const match = /([0-9,]+)/.exec(t);
  return match ? +match[1].replace(/,/g, '') : undefined;
}
