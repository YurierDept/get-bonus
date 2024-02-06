<script setup lang="ts">
import type { Detail } from 'get-bonus';

import { toast } from 'vue-sonner';
import { Copy } from 'lucide-vue-next';

const props = defineProps<{
  data: Detail;
}>();

const baseUrl = computed(() => {
  return new URL(props.data.url).origin;
});

async function copyUrl() {
  await navigator.clipboard.writeText(props.data.url);
  toast.success(`复制商家链接成功`, {});
}
</script>

<template>
  <li class="p-4 b-1 rounded-4">
    <span>
      <nuxt-link class="font-bold text-5 hover:color-blue" :to="data.url" target="_blank">
        <span>{{ data.title }}</span>
      </nuxt-link>
      <Button @click="copyUrl" variant="secondary" size="sm" margin-left="3px" class="ml-3 mt-3">
        <Copy class="w-4 h-4 mr-2"></Copy>复制商家链接
      </Button>
    </span>
    <span class="mt-2 flex items-center gap-2">
      <a :href="baseUrl" target="_blank">
        <Badge variant="outline" class="select-none">{{ data.provider }}</Badge>
      </a>
      <Badge v-if="data.date" variant="outline"
        ><span class="select-none mr-1">发售于</span><span>{{ data.date }}</span>
      </Badge>
      <Badge v-if="data.price" variant="outline"
        ><span class="select-none mr-1">¥</span><span>{{ data.price }}</span>
      </Badge>
    </span>
    <ul>
      <TokutenItem
        v-for="(item, i) in data.items"
        :provider="data.provider"
        :title="data.title"
        :index="i"
        :data="item"
      />
    </ul>
  </li>
</template>
