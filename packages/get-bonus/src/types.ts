export interface SearchOptions {
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

  items: DetailItem[];

  // TODO
}

export interface DetailItem {
  image: string;

  description: string;
}