import type { Detail, SearchResult, SearchOptions } from '../types';

import { Provider } from '../scraper';

export class Toranoana extends Provider {
  constructor() {
    super('toranoana');
  }

  async search(text: string, options?: SearchOptions): Promise<SearchResult[]> {
    return [];
  }

  async detail(url: string): Promise<Detail | undefined> {
    return undefined;
  }
}
