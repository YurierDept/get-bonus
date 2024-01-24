<script setup lang="ts">
import type { Detail } from 'get-bonus';

import { Badge } from './ui/badge';

defineProps<{ results: Detail[] }>();

const getBase = (url: string) => {
  return new URL(url).origin;
};
</script>

<template>
  <ul class="grid gap-4">
    <li v-for="{ provider, title, url, items } in results" class="p-4 b-1 rounded-4">
      <nuxt-link class="font-bold text-5 hover:color-blue" :to="url" target="_blank">
        <span>{{ title }}</span>
      </nuxt-link>
      <span class="mt-2 flex items-center">
        <a :href="getBase(url)" target="_blank">
          <Badge variant="outline">{{ provider }}</Badge>
        </a>
      </span>
      <ul>
        <li v-for="{ image, description } in items" class="flex gap-4 mt-4">
          <img class="max-w-36" :src="image" />
          <p class="text-3.5 whitespace-pre-line">{{ description }}</p>
        </li>
      </ul>
    </li>
  </ul>
</template>
