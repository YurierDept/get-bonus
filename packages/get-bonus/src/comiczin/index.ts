import type { Detail, SearchResult } from '../types';

import { Provider } from '../scraper';

export class Comiczin extends Provider {
  constructor() {
    super('comiczin');
  }

  async search(text: string): Promise<SearchResult[]> {
    return [];
  }

  async detail(url: string): Promise<Detail | undefined> {
    return undefined;
  }
}
