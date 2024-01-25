export interface SearchOptions {
  onlySearchTitle: string;

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

  items: DetailItem[];

  // TODO
}

export interface DetailItem {
  image: string;

  description: string;
}
