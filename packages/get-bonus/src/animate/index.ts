import type { Detail, SearchResult } from '../types';

import { Provider } from '../scraper';

export class Animate extends Provider {
  constructor() {
    super('animate');
  }

  async search(text: string): Promise<SearchResult[]> {
    return [];
  }

  async detail(url: string): Promise<Detail | undefined> {
    return undefined;
  }
}
