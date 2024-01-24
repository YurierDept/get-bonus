import { scraper } from '../../scraper';

export default defineEventHandler(async (event) => {
  const input = getRouterParam(event, 'input', {
    decode: true
  });
  if (!input) {
    throw new Error(`Input is not given`);
  }

  const searchResult = await scraper.search(input);
  const details = await scraper.getAllDetails(Object.values(searchResult).flat(1));

  return {
    input,
    result: details
  };
});
