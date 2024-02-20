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
      ?.nextElementSibling?.textContent?.split?.('+');
    const tbody = doc.querySelector('.spec-table > tbody:nth-child(1)');  
    const rows = tbody?.querySelectorAll('tr'); 
    let date;
    let price;
    rows?.forEach(row => {  
      const thElements = row.querySelectorAll('th');  
      thElements.forEach(th => {  
        if (th.textContent?.trim() === '発売日') {  
          // 找到包含“発売日”的<th>，选择其后的<td>  
          const tdElement = th.nextElementSibling;  
          if (tdElement && tdElement.tagName.toLowerCase() === 'td') {  
            date = tdElement.textContent?.trim();  
          }  
        }  
      });  
    });
    rows?.forEach(row => {  
      const thElements = row.querySelectorAll('th');  
      thElements.forEach(th => {  
        if (th.textContent?.trim() === '価格') {  
          // 找到包含“価格”的<th>，选择其后的<td>  
          const tdElement = th.nextElementSibling;  
          if (tdElement && tdElement.tagName.toLowerCase() === 'td') {  
            price = resolvePrice(tdElement.textContent?.trim()); 
          }  
        }  
      });  
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
