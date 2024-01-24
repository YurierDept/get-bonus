import type { Detail, SearchResult } from '../types';

import { Provider } from '../scraper';

export class Mangaoh extends Provider {
  constructor() {
    super('mangaoh');
  }

  async search(text: string): Promise<SearchResult[]> {
    return [];
  }

  async detail(url: string): Promise<Detail | undefined> {
    return undefined;
  }
}
