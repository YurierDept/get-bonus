<script setup lang="ts">
import type { SubjectInformation, SubjectPersons, PersonInformation } from 'bgmc';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

import { toast } from 'vue-sonner';
import { ClipboardCopy } from 'lucide-vue-next';

type PersonDetail = SubjectPersons[0] & { detail: PersonInformation };

const props = defineProps<{
  input: string;
  subject: SubjectInformation;
  persons: PersonDetail[] | null;
}>();

const persons = computed(() => {
  const raw = props.persons;
  const info: Record<string, PersonDetail[]> = {};
  for (const pair of raw ?? []) {
    if (!info[pair.relation]) {
      info[pair.relation] = [];
    }
    info[pair.relation].push(pair);
  }
  return Object.entries(info);
});

function inferLink(person: PersonInformation) {
  const official = person.infobox?.filter((ib) =>
    ['引用来源', '官方网站'].includes(ib.key as string)
  );
  return official?.[0]?.value as string | undefined;
}

function inferTwitter(person: PersonInformation) {
  const twitter = person.infobox?.filter((ib) =>
    ['推特', 'X (Twitter)', 'Twitter'].includes(ib.key as string)
  );
  const name = twitter?.[0]?.value as string | undefined;
  if (!name) return undefined;
  // TODO: 临时处理, 后续优化为支持数组
  if (Array.isArray(name)) return undefined;
  // Fix `https://twitter.com/...` to `@...`
  const twitterURL = `https://twitter.com/`;
  if (name.startsWith(twitterURL)) {
    return '@' + name.slice(twitterURL.length);
  }
  const xURL = `https://x.com/`;
  if (name.startsWith(xURL)) {
    return '@' + name.slice(xURL.length);
  }
  if (name.startsWith('@')) {
    return name;
  }
  return '@' + name;
}

async function copyOriginTitle() {
  await navigator.clipboard.writeText(props.subject.name);
  toast.success(`复制原文标题成功`, {});
}

const colorMode = useColorMode();
</script>

<template>
  <Card class="w-full mb-6">
    <CardContent class="flex gap-4 lt-md:flex-col p-6">
      <div class="flex flex-col">
        <NuxtImg v-show="colorMode.value === 'light'" class="max-w-36" :src="subject.images.large" placeholder="./load-placeholder.png"/>
        <NuxtImg v-show="colorMode.value === 'dark'" class="max-w-36" :src="subject.images.large" placeholder="./load-placeholder-dark-mode.png"/>
      </div>
      <div>
        <CardHeader>
          <CardTitle>
            <span v-if="subject.name_cn && subject.name"
              ><span>{{ subject.name_cn }}</span
              ><span class="inline-block ml-3 font-normal text-base"
                >原文标题：{{ subject.name }}</span
              ></span
            >
            <span v-else>{{ subject.name }}</span>
          </CardTitle>
          <Button @click="copyOriginTitle" variant="secondary" size="sm" class="mt-3">
            <ClipboardCopy class="w-4 h-4 mr-2"></ClipboardCopy>复制原文标题
          </Button>
        </CardHeader>
        <div class="mt-6 space-y-1">
          <div v-for="[relation, list] in persons" :key="relation">
            <span class="font-bold mr-2">{{ relation }}</span>
            <span v-for="(person, idx) in list">
              <span v-if="idx > 0" class="select-none">, </span>
              <a
                v-if="inferLink(person.detail)"
                :href="inferLink(person.detail)"
                target="_blank"
                class="hover:text-blue-500"
                >{{ person.name }}</a
              >
              <span v-else>{{ person.name }}</span>
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
            </span>
          </div>
          <div class="mt-1">
            <a :href="`https://bgm.tv/subject/${subject.id}`" target="_blank" class="color-blue"
              >查看作品在 Bangumi 番组计划 的条目 →</a
            >
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter class="flex flex-col items-start px-6 pt-4 pb-6 border-t text-sm space-y-1">
      <div>
        ①信息来自
        <a
          href="https://bgm.tv/"
          target="_blank"
          class="text-blue-400 hover:text-blue-500 hover:underline"
          >Bangumi 番组计划</a
        >
        。
        <br />②如果本卡片的展现结果不符合预期（如：作品完全不对；想搜本作却搜到外传），请检查搜索关键词是否完整无误，避免使用简称。也可以
        <a
          :href="`https://bgm.tv/subject_search/${input}?cat=1`"
          target="_blank"
          class="text-blue-400 hover:text-blue-500 hover:underline"
          >在 Bangumi 番组计划 使用相同的搜索关键词详细搜索 →</a
        >
      </div>
    </CardFooter>
  </Card>
</template>
