import { BgmClient } from 'bgmc';

const client = new BgmClient(fetch);

export default defineEventHandler(async (event) => {
  const input = getRouterParam(event, 'input', {
    decode: true
  });
  if (!input) {
    throw new Error(`Input is not given`);
  }

  const resp = await client.search(input, {
    type: 1, // book
    responseGroup: 'large'
  });
  console.log(resp);

  if (resp.list && resp.list.length > 0) {
    const found = resp.list[0];

    if (found.id) {
      const subject = await client.subject(found.id);
      return {
        detail: subject
      };
    }
  }

  return { detail: null };
});
