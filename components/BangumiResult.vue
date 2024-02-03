<script setup lang="ts">
import type { SubjectInformation, SubjectPersons, PersonInformation } from 'bgmc';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

const props = defineProps<{
  input: string;
  subject: SubjectInformation;
  persons: Array<SubjectPersons[0] & { detail: PersonInformation }> | null;
}>();

function inferTwitter(person: PersonInformation) {
  const twitter = person.infobox?.filter(
    (ib) => ib.key === 'X (Twitter)' || (ib.key as string).toLowerCase() === 'twitter'
  );
  const name = twitter?.[0]?.value as string | undefined;
  if (!name) return undefined;
  // Fix `https://twitter.com/...` to `@...`
  const twitterURL = `https://twitter.com/`;
  if (name.startsWith(twitterURL)) {
    return '@' + name.slice(twitterURL.length);
  }
  if (name.startsWith('@')) {
    return name;
  }
  return '@' + name;
}
</script>

<template>
  <Card class="w-full mb-6">
    <CardHeader>
      <CardTitle>
        <a :href="`https://bgm.tv/subject/${subject.id}`" target="_blank" class="hover:color-blue">
          <span v-if="subject.name_cn && subject.name"
            ><span>{{ subject.name_cn }}</span
            ><span class="inline-block ml-2 font-normal text-base">{{ subject.name }}</span></span
          >
          <span v-else>{{ subject.name }}</span>
        </a>
      </CardTitle>
      <CardDescription class="mt-2">
        <span>Bgm ID: </span>
        <a
          :href="`https://bgm.tv/subject/${subject.id}`"
          target="_blank"
          class="hover:color-blue"
          >{{ subject.id }}</a
        >
      </CardDescription>
    </CardHeader>
    <CardContent class="flex gap-4">
      <div><NuxtImg class="max-w-36" :src="subject.images.large" :placeholder="144" /></div>
      <div>
        <div class="text-sm">{{ subject.summary }}</div>
        <div class="mt-4 space-y-1">
          <div v-for="person in persons">
            <span class="font-bold mr-2">{{ person.relation }}</span>
            <span>{{ person.name }}</span>
            <a
              v-if="inferTwitter(person.detail)"
              class="ml-2 inline-block"
              :href="`https://twitter.com/${inferTwitter(person.detail)?.slice(1)}`"
              target="_blank"
            >
              <span class="text-blue-400 hover:text-blue-500">{{
                inferTwitter(person.detail)
              }}</span>
            </a>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter class="flex flex-col items-start px-6 pt-4 pb-6 border-t text-sm space-y-1">
      <div>
        上述信息来自
        <a
          href="https://bgm.tv/"
          target="_blank"
          class="text-blue-400 hover:text-blue-500 hover:underline"
          >Bangumi 番组计划</a
        >。
      </div>
      <div>
        因版面所限，仅展示在
        <a
          href="https://bgm.tv/"
          target="_blank"
          class="text-blue-400 hover:text-blue-500 hover:underline"
          >Bangumi 番组计划</a
        >
        的搜索结果中的第一条结果。
      </div>
      <div>
        需要进一步搜索，<a
          :href="`https://bgm.tv/subject_search/${input}?cat=1`"
          target="_blank"
          class="text-blue-400 hover:text-blue-500 hover:underline"
          >请点这里去 Bangumi 番组计划 搜索 →</a
        >
      </div>
    </CardFooter>
  </Card>
</template>
