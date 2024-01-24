import type { SearchResult, Detail, SearchOptions } from './types';

export class Scraper {
  private readonly providers: Provider[];

  public constructor(...providers: Provider[]) {
    this.providers = providers;
  }

  async search(text: string, options: Partial<SearchOptions> = {}) {
    const results = await Promise.all(
      this.providers.map(async (provider) => {
        try {
          const resp = await provider.search(text, options);
          return [provider.id, resp] as const;
        } catch (error) {
          console.log(`搜索 ${provider.id} 失败: ${text}`);
          console.error(error);
          return [provider.id, []];
        }
      })
    );
    return Object.fromEntries(results);
  }

  async getDetail(platform: string, url: string) {
    try {
      const providers = this.providers.filter((p) => p.id === platform);
      if (providers.length === 1) {
        return await providers[0].detail(url);
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(`获取详情失败: ${url}`);
      console.error(error);
      return undefined;
    }
  }

  async getAllDetails(search: SearchResult[]) {
    const resp = await Promise.all(
      search.map(async (t) => {
        try {
          return await this.getDetail(t.provider, t.url);
        } catch (error) {
          console.log(`获取详情失败: ${t.url}`);
          console.error(error);
          return undefined;
        }
      })
    );
    return resp.filter(Boolean) as Detail[];
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
