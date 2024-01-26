<script setup lang="ts">
import type { Detail } from 'get-bonus';

const props = defineProps<{
  data: Detail;
}>();

const baseUrl = computed(() => {
  return new URL(props.data.url).origin;
});
</script>

<template>
  <li class="p-4 b-1 rounded-4">
    <nuxt-link class="font-bold text-5 hover:color-blue" :to="data.url" target="_blank">
      <span>{{ data.title }}</span>
    </nuxt-link>
    <span class="mt-2 flex items-center gap-2">
      <a :href="baseUrl" target="_blank">
        <Badge variant="outline" class="select-none">{{ data.provider }}</Badge>
      </a>
      <Badge v-if="data.date" variant="outline"
        ><span class="select-none mr-1">发售于</span><span>{{ data.date }}</span></Badge
      >
      <Badge v-if="data.price" variant="outline"
        ><span class="select-none mr-1">¥</span><span>{{ data.price }}</span></Badge
      >
    </span>
    <ul>
      <li v-for="{ image, description } in data.items" class="flex gap-4 mt-4">
        <img class="max-w-36" :src="image" />
        <p class="text-3.5 whitespace-pre-line">{{ description }}</p>
      </li>
    </ul>
  </li>
</template>
