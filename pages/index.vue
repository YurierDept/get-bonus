<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const results = ref();

const searchInput = ref('');
const isSearching = ref(false);
const search = async () => {
  if (!searchInput.value) return;
  try {
    isSearching.value = true;
    const resp = await $fetch(`/api/search/${searchInput.value}`, {});
    results.value = resp.result;
  } finally {
    isSearching.value = false;
  }
};
</script>

<template>
  <div class="main">
    <div class="mt-10">
      <span class="text-4xl font-bold">Get Bonus</span>
    </div>
    <div class="mt-8 flex gap-4">
      <Input v-model="searchInput" @keydown.enter="search"></Input>
      <Button @click="search" :disabled="isSearching">
        <Loader2 v-if="isSearching" class="w-4 h-4 mr-2 animate-spin" />
        <span>搜索</span>
      </Button>
    </div>
    <ul class="grid gap-4 mt-6">
      <li v-for="{ title, url, items } in results" class="p-4 b-1 rounded-4">
        <nuxt-link class="font-bold text-5 hover:color-blue" :to="url" target="_blank">{{
          title
        }}</nuxt-link>
        <ul>
          <li v-for="{ image, description } in items" class="flex gap-4 mt-4">
            <img class="max-w-36" :src="image" />
            <p class="text-3.5 result-description">{{ description }}</p>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style>
.main {
  @apply: mx-auto w-5xl lt-lg:w-3xl lt-md:w-[95vw] lt-md:px-3;
}

.result-description {
  white-space: pre-line;
}
</style>
