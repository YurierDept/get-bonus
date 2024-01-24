<script setup lang="ts">
import type { Detail } from 'get-bonus';

import { Loader2, Search } from 'lucide-vue-next';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const results = ref<Detail[]>();

const searchInput = ref('');
const isSearching = ref(false);
const search = async () => {
  if (isSearching.value) return;
  if (!searchInput.value) return;
  try {
    isSearching.value = true;
    const resp = await $fetch(`/api/search/${searchInput.value}`, {});
    results.value = resp.result.filter(Boolean);
  } catch {
    results.value = [];
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
        <Search v-else class="w-4 h-4 mr-2"></Search>
        <span>搜索</span>
      </Button>
    </div>
    <div class="w-full mt-6 pb-16">
      <div v-if="isSearching" class="w-full"><Skeleton class="h-60 w-full"></Skeleton></div>
      <SearchResult v-else-if="results && results.length > 0" :results="results"></SearchResult>
      <div v-else-if="results && results.length === 0" class="flex items-center justify-center">
        <span class="text-2xl font-bold">未找到商品</span>
      </div>
    </div>
  </div>
</template>

<style>
.main {
  @apply: mx-auto w-5xl lt-lg:w-3xl lt-md:w-[95vw] lt-md:px-3;
}
</style>
