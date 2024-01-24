import { scraper } from '../../scraper';

export default defineEventHandler((event) => {
  const input = getRouterParam(event, 'input');

  return {
    input
  };
});
