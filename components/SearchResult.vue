<script setup lang="ts">
import type { Detail } from 'get-bonus';
import { AlertCircle, SearchCheck } from 'lucide-vue-next';

const props = defineProps<{ details: Record<string, Detail[]> }>();

const platforms = [`Melonbooks`, `Animate`, `虎穴`, `Gamers`, `Comic Zin`, `漫画王`];
</script>

<template>
  <Tabs
    type="multiple"
    :default-value="platforms.find((id) => details[id] && details[id].length > 0)"
  >
    <TabsList>
      <TabsTrigger v-for="id in platforms" :key="id" :value="id">
        {{ id }} 
        <SearchCheck v-if="details[id] && details[id].length > 0" class="w-4 h-4 ml-1"></SearchCheck>
        <AlertCircle v-else class="w-4 h-4 ml-1"></AlertCircle>
      </TabsTrigger>
    </TabsList>
    <TabsContent v-for="id in platforms" :key="id" :value="id">
      <ul v-if="details[id] && details[id].length > 0" class="grid gap-4 w-full">
        <ResultItem v-for="result in details[id]" :key="result.url" :data="result" />
      </ul>
      <div v-else>
        <Card>
          <CardContent class="p-6">
            <p>在此商家未找到结果。试试再次搜索？</p>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  </Tabs>
</template>
