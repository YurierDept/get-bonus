import { BgmClient, type Search } from 'bgmc';

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
    // 获取第一个搜索结果
    const foundId = await inferSubject(resp.list);

    if (foundId) {
      const [subject, persons] = await Promise.all([
        client.subject(foundId),
        client.subjectPersons(foundId)
      ]);

      const filterRelation = ['作者', '插图', '作画', '出版社', '连载杂志', '文库'];
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

/**
 * 1. 使用搜索结果的第一个
 * 2. 如果它是系列中的某一部，则使用系列
 */
async function inferSubject(subjects: Search['list']) {
  if (!subjects) return undefined;
  const first = subjects[0];
  if (!first || !first.id) return undefined;

  const related = await client.subjectRelated(first.id);
  const series = related.filter((rel) => rel.relation === '系列')[0];
  if (series) {
    return series.id;
  } else {
    return first.id;
  }
}
