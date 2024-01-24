<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const results = ref();

const searchInput = ref('');
const search = async () => {
  if (!searchInput.value) return;
  const resp = await $fetch(`/api/search/${searchInput.value}`, {});
  results.value = resp.result;
};
</script>

<template>
  <div class="main">
    <div class="mt-10">
      <span class="text-4xl font-bold">Get Bonus</span>
    </div>
    <div class="mt-8 flex gap-4">
      <Input v-model="searchInput" @keydown.enter="search"></Input>
      <Button @click="search">搜索</Button>
    </div>
    <ul class="grid gap-4 mt-6">
      <li v-for="{ title, url, items } in results" class="p-4 b-1 rounded-4">
        <nuxt-link class="font-bold hover:color-blue" :to="url" target="_blank">{{ title }}</nuxt-link>
        <ul>
          <li v-for="{ image, description } in items" class="flex gap-2 mt-2">
            <img class="max-w-36" :src="image"/>
            <p>{{ description }}</p>
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
</style>
