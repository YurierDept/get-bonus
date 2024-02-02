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

  if (resp.list && resp.list.length > 0) {
    const found = resp.list[0];

    if (found.id) {
      const [subject, persons] = await Promise.all([
        client.subject(found.id),
        client.subjectPersons(found.id)
      ]);

      const filterRelation = ['作者', '插图', '出版社', '连载杂志', '文库'];
      const detailedPersons = await Promise.all(
        persons
          .filter((person) => filterRelation.includes(person.relation))
          .map(async (person) => {
            return {
              ...person,
              detail: await client.person(person.id)
            };
          })
      );

      return {
        subject,
        persons: detailedPersons
      };
    }
  }

  return { subject: null, persons: null };
});
