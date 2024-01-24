import type { SearchResult, Detail } from './types';

export class Scraper {
  private readonly providers: Provider[];

  public constructor(...providers: Provider[]) {
    this.providers = providers;
  }

  async search(text: string) {
    const results = await Promise.all(
      this.providers.map(async (provider) => {
        const resp = await provider.search(text);
        return resp;
      })
    );
    return results;
  }

  async getDetail(platform: string, url: string) {
    const providers = this.providers.filter((p) => p.platform === platform);
  }

  async getAllDetails(search: SearchResult[]) {}
}

export abstract class Provider {
  public readonly platform: string;

  constructor(name: string) {
    this.platform = name;
  }

  abstract search(text: string): Promise<SearchResult[]>;

  abstract detail(url: string): Promise<Detail | undefined>;
}
