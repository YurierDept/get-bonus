<script setup lang="ts">
import type { Detail } from 'get-bonus';

import { Loader2 } from 'lucide-vue-next';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const results = ref<Detail[]>();

const searchInput = ref('');
const isSearching = ref(false);
const search = async () => {
  if (!searchInput.value) return;
  try {
    isSearching.value = true;
    const resp = await $fetch(`/api/search/${searchInput.value}`, {});
    results.value = resp.result.filter(Boolean) as Detail[];
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
    <div class="w-full mt-6">
      <SearchResult v-if="results" :results="results"></SearchResult>
      <div v-else-if="isSearching" class="w-full">
        <Skeleton class="h-60 w-full"></Skeleton>
      </div>
    </div>
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
