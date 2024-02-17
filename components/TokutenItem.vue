<script setup lang="ts">
import type { DetailItem } from 'get-bonus';

import * as clipboard from 'clipboard-polyfill';
import { toast } from 'vue-sonner';
import { Download, Copy, ClipboardCopy } from 'lucide-vue-next';

const props = defineProps<{
  provider: string;
  title: string;
  index: number;
  data: DetailItem;
}>();

const img = useImage();

async function downloadImage() {
  try {
    const image = img(props.data.image);
    console.log(`下载图片:`, image);
    const blob = await $fetch<Blob>(image, { responseType: 'blob' });
    const url = URL.createObjectURL(blob);

    // 创建 a 标签
    const a = document.createElement('a');
    a.href = url;
    a.download = `${props.title}_${props.provider}_${props.index}`;
    a.click();

    // 清理
    URL.revokeObjectURL(url);

    toast.success('下载图片成功', {});
  } catch (error) {
    console.error(error);
    toast.error('下载图片失败', {});
  }
}

async function copyImage() {
  try {
    // 转换成 png
    const image = img(props.data.image, { format: 'png' });
    console.log(`复制图片:`, image);
    const blob = await $fetch<Blob>(image, { responseType: 'blob' });

    // 手动 focus
    if (!document.hasFocus()) {
      document.body.focus();
    }
    await clipboard.write([
      new clipboard.ClipboardItem({
        [blob.type]: blob
      })
    ]);
    toast.success('复制图片成功', {});
  } catch (error) {
    console.error(error);
    toast.error('复制图片失败', {});
  }
}

async function copyDescription() {
  try {
    document.body.focus();
    await clipboard.writeText(props.data.description);
    toast.success(`复制描述成功`, {});
  } catch (error) {
    console.error(error);
    toast.error('复制描述失败', {});
  }
}

const colorMode = useColorMode();
</script>

<template>
  <li class="flex gap-4 mt-4">
    <NuxtImg v-show="colorMode.value === 'light'" class="max-w-36" :src="data.image" placeholder="./load-placeholder.png" />
    <NuxtImg v-show="colorMode.value === 'dark'" class="max-w-36" :src="data.image" placeholder="./load-placeholder-dark-mode.png" />
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
