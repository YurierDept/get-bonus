import type { SearchResult, Detail, SearchOptions } from './types';

export class Scraper {
  public readonly providers: Provider[];

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
          return [provider.id, [] as SearchResult[]] as const;
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

  async getAllDetails(search: Record<string, SearchResult[]>) {
    const resp = await Promise.all(
      Object.entries(search).map(async ([id, list]) => {
        const details = await Promise.all(
          list.map(async (t) => {
            try {
              return await this.getDetail(t.provider, t.url);
            } catch (error) {
              console.log(`获取详情失败: ${t.url}`);
              console.error(error);
              return undefined;
            }
          })
        );
        return [id, details.filter(Boolean) as Detail[]] as const;
      })
    );
    return Object.fromEntries(resp);
  }
}

export abstract class Provider {
  public readonly id: string;

  public readonly baseUrl: string;

  constructor(name: string, baseUrl: string) {
    this.id = name;
    this.baseUrl = baseUrl;
  }

  abstract search(text: string, options: Partial<SearchOptions>): Promise<SearchResult[]>;

  abstract detail(url: string): Promise<Detail | undefined>;
}
