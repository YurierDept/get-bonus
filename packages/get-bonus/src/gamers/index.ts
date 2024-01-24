import type { Detail, SearchResult } from '../types';

import { Provider } from '../scraper';

export class Gamers extends Provider {
  constructor() {
    super('gamers');
  }

  async search(text: string): Promise<SearchResult[]> {
    return [];
  }

  async detail(url: string): Promise<Detail | undefined> {
    return undefined;
  }
}
