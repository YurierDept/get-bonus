import type { PersonInformation } from 'bgmc';

const TwitterKeys = ['推特', 'X (Twitter)', 'Twitter'];

const TwitterBaseURLs = [`https://twitter.com/`, `https://x.com/`, `twitter.com/`, `x.com/`];

export function inferPersonTwitter(person: PersonInformation) {
  const twitter = person.infobox?.filter((ib) => TwitterKeys.includes(ib.key as string));
  const names = twitter?.[0]?.value as string | Array<{ v?: string }> | undefined;
  if (!names) return undefined;

  const transform = (name: string) => {
    // Fix @coolkyousinnjya→@coolkyou2 -> @coolkyou2
    // 使用最后一个 id
    if (name.indexOf('→') !== -1) {
      name = name.split('→').at(-1) ?? name;
      name = name.trim();
    }
    for (const baseURL of TwitterBaseURLs) {
      // Fix `https://twitter.com/...` to `@...`
      if (name.startsWith(baseURL)) {
        return `@` + name.slice(baseURL.length);
      }
    }
    // Fix `...` to `@...`
    if (name.startsWith('@')) {
      return name;
    }
    return '@' + name;
  };

  if (Array.isArray(names)) {
    return names.map((name) => (name.v ? transform(name.v) : undefined)).filter(Boolean);
  } else if (typeof names === 'string') {
    return [transform(names)];
  }
  return undefined;
}
