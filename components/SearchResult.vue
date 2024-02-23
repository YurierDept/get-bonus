<script setup lang="ts">
import type { Detail } from 'get-bonus';
import { AlertCircle, SearchCheck, RotateCw } from 'lucide-vue-next';

const props = defineProps<{ details: Record<string, Detail[]> }>();

const platforms = [`Melonbooks`, `Animate`, `虎穴`, `Gamers`, `Comic Zin`, `漫画王`];
</script>

<template>
  <div class="p-2.5 b-1 rounded-2">
    店铺名称旁有
    <button variant="ghost" class="selecct-none"><SearchCheck class="w-3.5 h-3.5"></SearchCheck></button>
    即为搜索完成；
    店铺名称旁有
    <button variant="ghost" class="selecct-none"><AlertCircle class="w-3.5 h-3.5"></AlertCircle></button>
    则代表该店铺无搜索结果 或是 搜索错误，可点击对应的店铺 Tab 以查看排障指引或对单个店铺重新搜索。
  </div>
  <br/>
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
            <Button variant="secondary" size="sm" class="mb-2">
            <RotateCw class="w-4 h-4 mr-2"></RotateCw>重新搜索（仅重搜本店铺）
            </Button>
            <br/>
            在 {{ id }} 没有找到任何符合 搜索关键词 + 搜索条件（如有）的商品。
            <br/>
            <del>请先尝试点击「重新搜索（仅重搜本店铺）」按钮来重试一次。</del>此功能尚在开发，敬请期待。
            <br/>
            如果仍然没有搜索结果，请参考以下内容：
            <br/>
            1. 请先确认您在搜索框输入的是商品（书籍等）的<span class="font-bold"
              >原文（例如：日文）标题</span
              >，且输入准确无误、不是简称。 <br />如果您输入的是中文译名，您应该可以在此段文字上方的
              Bangumi 番组计划 信息卡片，一键复制原文标题，重新进行搜索。如果上方来自 Bangumi
              番组计划 的结果有误，请自行找到正确的原文标题。
            <br />
            2. 尝试调整搜索条件。
            <br />
            3. 尝试只输入作品名称，或是商品名称当中较为关键的词语；搜索书籍可删去 第X卷 / X 巻
              等卷数表述，改用半角数字（如：0 1 ……），或不带卷数搜索。
            <br />
            4.
            如果您访问本站的网络连接欠佳，可能也无法正常进行搜索并弹出本提示。请自行解决此类问题。
            <br />
            5. 如果您已阅读上述提示并都尝试过，但仍然无法解决问题，请
            <a
              href="https://github.com/YurierDept/get-bonus/issues"
              target="_blank"
              class="color-blue"
              >提交 Issue</a
            >
            给开发者，开发者会协助解决。
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  </Tabs>
</template>
