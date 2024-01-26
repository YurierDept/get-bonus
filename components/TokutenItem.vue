<script setup lang="ts">
import type { DetailItem } from 'get-bonus';

const props = defineProps<{
  data: DetailItem;
}>();

async function downloadImage() {
  // TODO
}

async function copyImage() {
  // TODO
}

function copyDescription() {
  navigator.clipboard.writeText(props.data.description);
}
</script>

<template>
  <li class="flex gap-4 mt-4">
    <img class="max-w-36" :src="data.image" />
    <div class="grid grid-rows-[1fr_auto] gap-2">
      <p class="text-3.5 whitespace-pre-line">{{ data.description }}</p>
      <div class="flex gap-2">
        <Button @click="downloadImage">下载图片</Button>
        <Button @click="copyImage">复制图片</Button>
        <Button @click="copyDescription">复制描述</Button>
      </div>
    </div>
  </li>
</template>
