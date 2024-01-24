<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const searchInput = ref('');
const search = async () => {
  if (!searchInput.value) return;
  const resp = await $fetch(`/api/search/${searchInput.value}`, {});
  console.log(resp);
};
</script>

<template>
  <!-- <NuxtWelcome /> -->
  <div class="main">
    <div class="mt-10">
      <span class="text-4xl font-bold">Get Bonus</span>
    </div>
    <div class="mt-8 flex gap-4">
      <Input v-model="searchInput" @keydown.enter="search"></Input>
      <Button @click="search">搜索</Button>
    </div>
  </div>
</template>

<style>
.main {
  @apply: mx-auto w-5xl lt-lg:w-3xl lt-md:w-[95vw] lt-md:px-3;
}
</style>
