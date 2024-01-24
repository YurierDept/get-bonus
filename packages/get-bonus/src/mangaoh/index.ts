import type { Detail, SearchResult, SearchOptions } from '../types';

import { Provider } from '../scraper';

export class Mangaoh extends Provider {
  constructor() {
    super('mangaoh');
  }

  async search(text: string, options?: SearchOptions): Promise<SearchResult[]> {
    return [];
  }

  async detail(url: string): Promise<Detail | undefined> {
    return undefined;
  }
}
