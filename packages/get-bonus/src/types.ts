export interface SearchOptions {
  onlySearchTitle: boolean;

  category: string;
  // TODO
}

export interface SearchResult {
  provider: string;

  title: string;

  url: string;

  // TODO
}

export interface Detail {
  provider: string;

  title: string;

  url: string;

  date?: string;

  price?: number;

  status?: '预售' | '有货' | '缺货';

  items: DetailItem[];

  // TODO
}

export interface DetailItem {
  image: string;

  description: string;
}
