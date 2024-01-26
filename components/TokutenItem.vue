<script setup lang="ts">
import type { DetailItem } from 'get-bonus';

import { toast } from 'vue-sonner';
import { Download, Copy, ClipboardCopy } from 'lucide-vue-next';

const props = defineProps<{
  data: DetailItem;
}>();

async function downloadImage() {
  // TODO
  toast('WIP', { description: 'WIP' });
}

async function copyImage() {
  // TODO
  toast('WIP', { description: 'WIP' });
}

async function copyDescription() {
  await navigator.clipboard.writeText(props.data.description);
  toast(`复制描述成功`, {});
}
</script>

<template>
  <li class="flex gap-4 mt-4">
    <img class="max-w-36" :src="data.image" />
    <div class="grid grid-rows-[1fr_auto] gap-2">
      <p class="text-3.5 whitespace-pre-line">{{ data.description }}</p>
      <div class="flex gap-4">
        <Button @click="downloadImage" variant="secondary" size="sm"
          ><Download class="w-4 h-4 mr-2" />下载图片</Button
        >
        <Button @click="copyImage" variant="secondary" size="sm"
          ><Copy class="w-4 h-4 mr-2"></Copy>复制图片</Button
        >
        <Button @click="copyDescription" variant="secondary" size="sm"
          ><ClipboardCopy class="w-4 h-4 mr-2"></ClipboardCopy>复制描述</Button
        >
      </div>
    </div>
  </li>
</template>
