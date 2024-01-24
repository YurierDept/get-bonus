import type { Detail, SearchResult, SearchOptions } from '../types';

import { Provider } from '../scraper';

export class Gamers extends Provider {
  constructor() {
    super('gamers');
  }

  async search(text: string, options?: SearchOptions): Promise<SearchResult[]> {
    return [];
  }

  async detail(url: string): Promise<Detail | undefined> {
    return undefined;
  }
}
