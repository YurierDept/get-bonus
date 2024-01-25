import type { Detail, SearchResult, SearchOptions, DetailItem } from '../types';

import { JSDOM } from 'jsdom';
import { ofetch } from 'ofetch';

import { Provider } from '../scraper';

export class Animate extends Provider {
  constructor() {
    super('animate', 'https://www.animate-onlineshop.jp');
  }

  async search(text: string, options: Partial<SearchOptions>): Promise<SearchResult[]> {
    const html = await ofetch(this.baseUrl + '/products/list.php',{
      query:{
        mode: 'search',
        smt: text
      }
    });

    const dom = new JSDOM(html);
    const doc = dom.window.document;
    
    return [];
  }

  async detail(url: string): Promise<Detail | undefined> {
    return undefined;
  }
}
