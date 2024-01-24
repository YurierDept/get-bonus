import { scraper } from '../../scraper';

export default defineEventHandler(async (event) => {
  const input = getRouterParam(event, 'input', {
    decode: true
  });
  if (!input) {
    throw new Error(`Input is not given`);
  }

  const result = await scraper.search(input);

  return {
    input,
    result
  };
});
