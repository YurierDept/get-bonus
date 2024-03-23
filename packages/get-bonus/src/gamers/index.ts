import type { Detail, SearchResult, SearchOptions, DetailItem } from '../types';

import { JSDOM } from 'jsdom';
import { ofetch } from 'ofetch';

import { Provider } from '../scraper';
import { removeExtraSpaces, retryFn } from '../utils';

export class Gamers extends Provider {
  constructor() {
    super('Gamers', 'https://www.gamers.co.jp');
  }

  async search(text: string, options: Partial<SearchOptions>): Promise<SearchResult[]> {
    const html = await ofetch(this.baseUrl + '/products/list.php', {
      query: {
        smt: text,
        spc: 4,
        'nd[]': [5, 6]
      },
      retry: 5
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
    return retryFn(
      async () => {
        const resp = await ofetch.raw(url, { retry: 5 });

        const html = resp._data! as string;
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        const titleElement = doc.querySelector('#item_detail h1');
        const title = titleElement?.textContent?.trim?.() || '';

        /**
         * 返回了以下东西, 重试
         * 
         * ただいま、大変サイトが混み合っております。
         * 申し訳ありませんが、しばらく時間を置いて
         * アクセスしていただけますようお願いいたします。
         */
        if (!title) {
          throw new Error(doc?.body?.textContent ?? 'Unknown');
        }

        const price = resolvePrice(
          doc.querySelector('.item_detail_price .price')?.textContent?.trim()
        );
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

        const isLimited = title.includes('限定版');
        if (isLimited == true) {
          const itemImgMain = doc.querySelector('.item_img_main');
          const imgZoom = itemImgMain?.querySelector('.img_zoom') as HTMLImageElement;
          items.unshift({
            image: imgZoom.src,
            description: '此为Gamers限定版。商品信息如图所示。'
          });
        }

        return {
          provider: this.id,
          title,
          date,
          price,
          url,
          items
        };
      },
      // 重试 5 次, 每次间隔 1 秒
      { retry: 5, delay: 1000 }
    );
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
