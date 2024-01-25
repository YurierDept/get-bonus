import type { Detail, SearchResult, SearchOptions, DetailItem } from '../types';

import { JSDOM } from 'jsdom';
import { ofetch } from 'ofetch';

import { Provider } from '../scraper';

export class Melonbooks extends Provider {
  constructor() {
    super('melonbooks', 'https://www.melonbooks.co.jp');
  }

  async search(text: string, options: SearchOptions): Promise<SearchResult[]> {
    const html = await ofetch(this.baseUrl + '/search/search.php', {
      query: {
        mode: 'search',
        text_type: 'title', // 検索キーワード: 作品タイトル
        name: text,
        'additional[]': 'pr',
        'category_ids[]': '4', // コミック
        'child_category_ids[]': ['12', '43'] // コミック 和 ノベル
      }
    });

    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const resultItems = doc.querySelectorAll('.item-list li[class^=product]');
    return [...resultItems].map((item) => {
      const a = item.querySelector('.item-image > a') as HTMLAnchorElement;
      return {
        provider: this.id,
        title: a.title.trim(),
        url: this.baseUrl + a.href
      };
    });
  }

  async detail(url: string): Promise<Detail | undefined> {
    const html = await ofetch(url);
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const title = doc.querySelector('.page-header')?.textContent?.trim() || '';
    const date = resolveDate(doc.querySelector('.row_sale_date')?.textContent?.trim());
    const price = resolvePrice(doc.querySelector('.price .yen')?.textContent?.trim());

    const privItems = doc.querySelectorAll('.priv-item');
    const items = [...privItems].map((item) => {
      const img = item.querySelector('.priv_img') as HTMLImageElement;
      const info = item.querySelector('.priv-item_info');
      return {
        image: enforceHTTPS(img.src),
        description: info?.textContent?.trim?.() || ''
      };
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
 * Pattern: `発売日：2020年07月27日`
 */
function resolveDate(t?: string) {
  if (!t) return undefined;
  const RE = /(\d+)年(\d+)月(\d+)日/;
  const match = RE.exec(t);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return undefined;
}

/**
 * Pattern: `¥2,970`
 */
function resolvePrice(t?: string) {
  console.log(t);
  if (!t) return undefined;
  const match = /([0-9,]+)/.exec(t);
  return match ? +match[1].replace(/,/g, '') : undefined;
}

function enforceHTTPS(url: string) {
  if (url.startsWith('//')) {
    return 'https:' + url;
  } else {
    return url;
  }
}
