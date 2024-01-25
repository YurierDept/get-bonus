<script setup lang="ts">
import type { Detail } from 'get-bonus';

import { Loader2, Search } from 'lucide-vue-next';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const route = useRoute();
const router = useRouter();

const { data } = await useAsyncData('search_results', async () =>
  route.query.q ? $fetch(`/api/search/${route.query.q}`) : undefined
);

const details = ref<Record<string, Detail[]> | null>(data.value?.details ?? null);
const foundNums = computed(() => {
  return Object.entries(details.value ?? {}).reduce((acc, t) => acc + t[1].length, 0);
});

const searchInput = ref('');
const isSearching = ref(false);
const search = async () => {
  if (isSearching.value) return;
  if (!searchInput.value) return;

  router.push({
    path: route.path,
    query: { q: searchInput.value }
  });

  try {
    isSearching.value = true;
    const resp = await $fetch(`/api/search/${searchInput.value}`, {});
    details.value = resp.details;
  } catch {
    details.value = {};
  } finally {
    isSearching.value = false;
  }
};
</script>

<template>
  <div class="main">
    <div class="mt-10 select-none">
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
      <SearchResult v-else-if="details && foundNums > 0" :details="details"></SearchResult>
      <div v-else-if="details && foundNums === 0" class="flex items-center justify-center">
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
