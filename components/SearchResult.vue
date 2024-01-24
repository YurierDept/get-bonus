<script setup lang="ts">
import type { Detail } from 'get-bonus';

import { Badge } from './ui/badge';

defineProps<{ results: Detail[] }>();
</script>

<template>
  <ul class="grid gap-4">
    <li v-for="{ provider, title, url, items } in results" class="p-4 b-1 rounded-4">
      <nuxt-link class="font-bold text-5 hover:color-blue" :to="url" target="_blank">
        <span>{{ title }}</span>
        <Badge variant="outline">{{ provider }}</Badge>
      </nuxt-link>
      <ul>
        <li v-for="{ image, description } in items" class="flex gap-4 mt-4">
          <img class="max-w-36" :src="image" />
          <p class="text-3.5 result-description">{{ description }}</p>
        </li>
      </ul>
    </li>
  </ul>
</template>

<style>
.result-description {
  @apply whitespace-pre-line;
}
</style>
