import { scraper } from '../../scraper';

export default defineEventHandler(async (event) => {
  const input = getRouterParam(event, 'input', {
    decode: true
  });
  if (!input) {
    throw new Error(`Input is not given`);
  }

  const providersInfo = scraper.providers.map((p) => ({ id: p.id, baseUrl: p.baseUrl }));
  const searchResult = await scraper.search(input);
  const details = await scraper.getAllDetails(searchResult);

  return {
    providers: providersInfo,
    details
  };
});
