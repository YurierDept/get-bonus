import type { Detail, SearchResult, SearchOptions } from '../types';

import { Provider } from '../scraper';
import { ofetch } from 'ofetch';
import { JSDOM } from 'jsdom';

export class Comiczin extends Provider {
  constructor() {
    super('comiczin', 'https://shop.comiczin.jp');
  }

  async search(text: string, options: SearchOptions): Promise<SearchResult[]> {
    const html = await ofetch(this.baseUrl + '/products/list.php', {
      query: {
        mode: 'search',
        name: text
      }
    });

    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const resultItems = doc.querySelectorAll('div.list_item');

    return [...resultItems].map((item) => {
      const a = item.querySelector('a.title_area') as HTMLAnchorElement;
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

    const title = doc.querySelector('.fw_main_block_header_type2');
    const imgs = doc.querySelectorAll('img[id^=sample_img]:not(img[src$="s.jpg"])');
    const descs = doc.querySelector('.div_block_main_item_comment')?.textContent;
    const date = resolveDate(descs?.substring(descs.lastIndexOf('【発売日】')).split('\n')[0].replace('【発売日】',''));
    const price = resolvePrice(doc.querySelector('#form1')?.querySelector('.fnt_size_12em')?.textContent?.trim());
    const items = [...imgs]
      .map((img, i) => ({
        image: this.baseUrl + (img as HTMLImageElement).src,
        description: descs?.substring(descs.lastIndexOf('【ZIN特典】')).split('\n')[0].replace('【ZIN特典】','') || ''
      }));
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
 * Pattern: `【発売日】2020/03/24`
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
 * Pattern: `693`
 */
function resolvePrice(t?: string) {
  console.log(t);
  if (!t) return undefined;
  const match = /([0-9,]+)/.exec(t);
  return match ? +match[1].replace(/,/g, '') : undefined;
}
