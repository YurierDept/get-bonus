<script setup lang="ts">
import type { SubjectInformation, SubjectPersons, PersonInformation } from 'bgmc';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

const props = defineProps<{
  subject: SubjectInformation;
  persons: Array<SubjectPersons[0] & { detail: PersonInformation }> | null;
}>();

function inferTwitter(person: PersonInformation) {
  const twitter = person.infobox?.filter((ib) => ib.key === '推特');
  return twitter?.[0]?.value as string | undefined;
}
</script>

<template>
  <Card class="w-full mb-6">
    <CardHeader>
      <CardTitle>
        <a :href="`https://bgm.tv/subject/${subject.id}`" class="hover:color-blue">{{
          subject.name_cn || subject.name
        }}</a>
      </CardTitle>
      <CardDescription class="mt-2">
        <span>Bgm ID: </span>
        <a :href="`https://bgm.tv/subject/${subject.id}`" class="hover:color-blue">{{
          subject.id
        }}</a>
      </CardDescription>
    </CardHeader>
    <CardContent class="flex gap-4">
      <div><NuxtImg class="max-w-36" :src="subject.images.large" /></div>
      <div>
        <div class="text-sm">{{ subject.summary }}</div>
        <div class="mt-4">
          <div v-for="person in persons">
            <span class="font-bold mr-2">{{ person.relation }}</span>
            <span>{{ person.name }}</span>
            <a
              v-if="inferTwitter(person.detail)"
              class="ml-2 inline-block select-none"
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
    <!-- <CardFooter class="flex justify-between px-6 pb-6">
      <Button variant="outline"> Cancel </Button>
      <Button>Deploy</Button>
    </CardFooter> -->
  </Card>
</template>
