import { BgmClient, type Search } from 'bgmc';
import { distance } from 'fastest-levenshtein';

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
    const foundId = await inferSubject(input, resp.list);

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
 * 使用编辑距离 (levenshtein distance)，选择一个标题最相似的 subject
 */
function selectSubject(input: string, subjects: Search['list']) {
  const result1 = closest(input, subjects!, (subject) => subject.name);
  const result2 = closest(input, subjects!, (subject) => subject.name_cn);

  return distance(input, result1.name ?? '') <= distance(input, result2.name_cn ?? '')
    ? result1
    : result2;

  function closest<T>(str: string, arr: T[], key: (value: T) => string | null | undefined) {
    let min_distance = Infinity;
    let min_index = 0;
    for (let i = 0; i < arr.length; i++) {
      const name = key(arr[i]);
      if (name === undefined || name === null) continue;
      const dist = distance(str, name);
      if (dist < min_distance) {
        min_distance = dist;
        min_index = i;
      }
    }
    return arr[min_index];
  }
}

/**
 * 1. 使用搜索结果的第一个
 * 2. 如果它是系列中的某一部，则使用系列
 */
async function inferSubject(input: string, subjects: Search['list']) {
  if (!subjects) return undefined;
  const first = selectSubject(input, subjects);
  if (!first || !first.id) return undefined;

  const related = await client.subjectRelated(first.id);
  const series = related.filter((rel) => rel.relation === '系列')[0];
  if (series) {
    return series.id;
  } else {
    return first.id;
  }
}
