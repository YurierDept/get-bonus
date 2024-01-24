import type { Detail, SearchResult } from '../types';

import { Provider } from '../scraper';

export class Melonbooks extends Provider {
  constructor() {
    super('melonbooks');
  }

  search(text: string): Promise<SearchResult[]> {
    throw new Error('Method not implemented.');
  }

  detail(url: string): Promise<Detail> {
    throw new Error('Method not implemented.');
  }
}
