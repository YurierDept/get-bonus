import type { SearchResult, Detail, SearchOptions } from './types';

export class Scraper {
  private readonly providers: Provider[];

  public constructor(...providers: Provider[]) {
    this.providers = providers;
  }

  async search(text: string, options: Partial<SearchOptions> = {}) {
    const results = await Promise.all(
      this.providers.map(async (provider) => {
        const resp = await provider.search(text, options);
        return [provider.id, resp] as const;
      })
    );
    return Object.fromEntries(results);
  }

  async getDetail(platform: string, url: string) {
    const providers = this.providers.filter((p) => p.id === platform);
    if (providers.length === 1) {
      return providers[0].detail(url);
    } else {
      return undefined;
    }
  }

  async getAllDetails(search: SearchResult[]) {
    return await Promise.all(
      search.map(async (t) => {
        return this.getDetail(t.provider, t.url);
      })
    );
  }
}

export abstract class Provider {
  public readonly id: string;

  constructor(name: string) {
    this.id = name;
  }

  abstract search(text: string, options: Partial<SearchOptions>): Promise<SearchResult[]>;

  abstract detail(url: string): Promise<Detail | undefined>;
}
