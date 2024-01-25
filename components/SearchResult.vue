<script setup lang="ts">
import type { Detail } from 'get-bonus';

import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const props = defineProps<{ details: Record<string, Detail[]> }>();

const detailEntries = computed(() => {
  return Object.entries(props.details).filter((d) => d[1].length > 0);
});

const getBase = (url: string) => {
  return new URL(url).origin;
};
</script>

<template>
  <Accordion type="multiple" :default-value="detailEntries.map((d) => d[0])">
    <AccordionItem v-for="[id, results] in detailEntries" :key="id" :value="id">
      <AccordionTrigger>{{ id }}</AccordionTrigger>
      <AccordionContent>
        <ul class="grid gap-4">
          <li
            v-for="{ provider, title, url, date, price, items } in results"
            :key="url"
            class="p-4 b-1 rounded-4"
          >
            <nuxt-link class="font-bold text-5 hover:color-blue" :to="url" target="_blank">
              <span>{{ title }}</span>
            </nuxt-link>
            <span class="mt-2 flex items-center gap-2">
              <a :href="getBase(url)" target="_blank">
                <Badge variant="outline" class="select-none">{{ provider }}</Badge>
              </a>
              <Badge v-if="date" variant="outline"
                ><span class="select-none mr-1">发售于</span><span>{{ date }}</span></Badge
              >
              <Badge v-if="price" variant="outline"
                ><span class="select-none mr-1">¥</span><span>{{ price }}</span></Badge
              >
            </span>
            <ul>
              <li v-for="{ image, description } in items" class="flex gap-4 mt-4">
                <img class="max-w-36" :src="image" />
                <p class="text-3.5 whitespace-pre-line">{{ description }}</p>
              </li>
            </ul>
          </li>
        </ul>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
  <!-- <div v-for="[id, results] in Object.entries(details)" :key="id"></div> -->
</template>
