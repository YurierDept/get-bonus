import { scraper } from '../../scraper';

export default defineEventHandler((event) => {
  const input = getRouterParam(event, 'input');
  if (!input) {
    throw new Error(`Input is not given`);
  }

  const result = scraper.search(input);

  return {
    input,
    result
  };
});
