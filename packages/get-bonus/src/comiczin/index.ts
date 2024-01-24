import type { Detail, SearchResult, SearchOptions } from '../types';

import { Provider } from '../scraper';

export class Comiczin extends Provider {
  constructor() {
    super('comiczin');
  }

  async search(text: string, options?: SearchOptions): Promise<SearchResult[]> {
    return [];
  }

  async detail(url: string): Promise<Detail | undefined> {
    return undefined;
  }
}
