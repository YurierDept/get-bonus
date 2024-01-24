import type { Detail, SearchResult, SearchOptions, DetailItem } from '../types';

import { JSDOM } from 'jsdom';
import { ofetch } from 'ofetch';

import { Provider } from '../scraper';

export class Animate extends Provider {
  constructor() {
    super('animate');
  }

  async search(text: string, options: SearchOptions): Promise<SearchResult[]> {
    return [];
  }

  async detail(url: string): Promise<Detail | undefined> {
    return undefined;
  }
}
