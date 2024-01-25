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
const search = async (input: string) => {
  if (isSearching.value) return;
  if (!input) return;

  router.push({
    path: route.path,
    query: { q: input }
  });

  try {
    isSearching.value = true;
    const resp = await $fetch(`/api/search/${input}`, {});
    details.value = resp.details;
  } catch {
    details.value = {};
  } finally {
    isSearching.value = false;
  }
};

// 跟随路径变化
watch(
  () => route.query.q,
  (q) => {
    if (!q) {
      searchInput.value = '';
      details.value = null;
    } else if (typeof q === 'string') {
      if (searchInput.value !== q) {
        searchInput.value = q;
        search(searchInput.value);
      }
    }
  }
);

const randomNum = 2;
const examples = [
  '週に一度クラスメイトを買う話',
  '星屑テレパス',
  'きみが死ぬまで恋をしたい',
  'このはな綺譚'
];
const random = (arr: string[]) => {
  const result = [];
  const tempArray = arr.slice(); // Create a copy of the original array
  for (let i = 0; i < randomNum; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    const selectedValue = tempArray[randomIndex];
    result.push(selectedValue);
    tempArray.splice(randomIndex, 1); // Remove the selected value from the temporary array
  }
  return result;
};
</script>

<template>
  <div class="main">
    <div class="mt-10 select-none">
      <span class="text-4xl font-bold">Get Bonus</span>
    </div>
    <div class="mt-8 flex gap-4">
      <Input v-model="searchInput" @keydown.enter="search(searchInput)"></Input>
      <Button @click="search(searchInput)" :disabled="isSearching">
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
      <div v-else class="border-t">
        <div class="mt-6 rounded-4 p-6 b-1 space-y-3 text-xl">
          <p class="[&>a]:underline underline-dotted [&>a:hover]:color-blue">
            快速从 <a href="https://www.animate.co.jp/">animate</a>,
            <a href="https://shop.comiczin.jp" target="_blank">comiczin</a>,
            <a href="https://www.gamers.co.jp" target="_blank">gamers</a>,
            <a href="https://www.mangaoh.co.jp" target="_blank">mangaoh</a>,
            <a href="https://www.melonbooks.co.jp" target="_blank">melonbooks</a>,
            <a href="https://ecs.toranoana.jp" target="_blank">虎之穴</a>
            等购物平台检索商品和对应特典
          </p>
          <p>
            试一试吧：
            <ClientOnly
              ><span v-for="(title, idx) in random(examples)" :key="title"
                >{{ idx > 0 ? '、' : ''
                }}<span
                  class="color-blue-400 hover:color-blue-500 cursor-pointer"
                  @click="search(title)"
                  >{{ title }}</span
                ></span
              ></ClientOnly
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.main {
  @apply: mx-auto w-5xl lt-lg:w-3xl lt-md:w-[95vw] lt-md:px-3;
}
</style>
