<script setup lang="ts">
import type { Detail } from 'get-bonus';
import type { SubjectInformation, SubjectPersons, PersonInformation } from 'bgmc';
import {
  Loader2,
  Search,
  Moon,
  Sun,
  Trash2,
  XCircle,
  Sparkles,
  History,
  AlertCircle,
  CircleDashed
} from 'lucide-vue-next';
import { ref, watchEffect } from 'vue';

import VPSwitchAppearance from '@/components/common/VPSwitchAppearance.vue';
import { Card, CardContent } from '@/components/ui/card';

const route = useRoute();
const router = useRouter();

// const { data } = await useAsyncData('search_results', async () =>
//   route.query.q
//     ? Promise.all([$fetch(`/api/search/${route.query.q}`), $fetch(`/api/bgm/${route.query.q}`, {})])
//     : undefined
// );

type FullDetail = {
  details: Record<string, Detail[]> | null;
  subject: SubjectInformation | null;
  persons: Array<SubjectPersons[0] & { detail: PersonInformation }> | null;
};

const details = ref<FullDetail | null>(
  null
  // data.value
  //   ? {
  //       details: data.value[0].details,
  //       subject: data.value[1]?.subject,
  //       persons: data.value[1]?.persons
  //     }
  //   : null
);

let abort: AbortController | null = null;
// const searchInput = ref((route.query.q as string | null) || '');
const searchInput = ref('');
const isSearching = ref(false);
const searchHistory = ref<string[]>([]);

const resetSearch = () => {
  if (!abort && !searchInput.value && !details.value) return;
  abort?.abort();
  searchInput.value = '';
  isSearching.value = false;
  details.value = null;
  router.push({
    path: route.path,
    query: { q: '' }
  });
};
const search = async (input: string) => {
  if (isSearching.value) return;
  if (!input) return;

  router.push({
    path: route.path,
    query: { q: input }
  });
  const updatedHistory = [input, ...searchHistory.value.filter((item) => item !== input)];
  searchHistory.value = updatedHistory.slice(0, 5);
  try {
    abort = new AbortController();
    isSearching.value = true;
    const [resp1, resp2] = await Promise.all([
      $fetch(`/api/search/${input}`, { signal: abort.signal }),
      $fetch(`/api/bgm/${input}`, { signal: abort.signal })
    ]);
    details.value = { details: resp1.details, subject: resp2.subject, persons: resp2.persons };
  } catch {
    details.value = { details: null, subject: null, persons: null };
  } finally {
    abort = null;
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
  },
  { immediate: true }
);

const foundNums = computed(() => {
  return Object.entries(details.value?.details ?? {}).reduce((acc, t) => acc + t[1].length, 0);
});

const randomNum = 2;
const examples = [
  '週に一度クラスメイトを買う話',
  '星屑テレパス',
  'きみが死ぬまで恋をしたい',
  'このはな綺譚',
  'まちカドまぞく',
  'ふたりべや',
  'ぼっち・ざ・ろっく',
  'はなにあらし',
  '春とみどり',
  'きんいろモザイク',
  '転生王女と天才令嬢の魔法革命'
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

const FixedTitlePart = '百合花船·特典搜索';
useHead({
  title() {
    const newTitle = route.query.q ? `${route.query.q} - ${FixedTitlePart}` : FixedTitlePart;
    return newTitle;
  }
});

// 初始化时从localStorage加载搜索历史
const initHistory = () => {
  const savedHistory = localStorage.getItem('searchHistory');
  if (savedHistory) {
    searchHistory.value = JSON.parse(savedHistory) as string[];
  }
};

// 移除历史记录中的某个条目
const removeHistoryItem = (index: number) => {
  searchHistory.value.splice(index, 1);
};

// 清空搜索历史
const clearHistory = () => {
  searchHistory.value = [];
};

onMounted(() => {
  initHistory();

  // 监听searchHistory的变化并保存到localStorage
  watchEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
  });
});
</script>

<template>
  <div class="main">
    <div class="flex md:gap-3 mt-10">
      <div>
        <span
          @click="resetSearch"
          class="text-4xl lt-sm:text-3xl title-font select-none cursor-pointer inline-block md:mr3"
          color="#45c2ff"
          >百合花船·特典搜索</span
        >
        <Badge component="span" variant="outline" class="inline-block select-none lt-sm:px-1.5"
          >Beta</Badge
        >
      </div>
      <div class="flex-auto"></div>
      <div class="flex items-end">
        <VPSwitchAppearance></VPSwitchAppearance>
      </div>
    </div>
    <div class="mt-8 flex gap-4">
      <Input
        v-model="searchInput"
        @keydown.enter="search(searchInput)"
        @keyup.enter="search(searchInput)"
        placeholder="搜前记得看首页说明"
      ></Input>
      <Button @click="search(searchInput)" :disabled="isSearching">
        <Loader2 v-if="isSearching" class="w-4 h-4 mr-2 animate-spin" />
        <Search v-else class="w-4 h-4 mr-2"></Search>
        <span class="title-font">搜索</span>
      </Button>
    </div>
    <div class="mt-4 gap-4">
      <Badge variant="outline" class="select-none mr-4">
        <button class="mr-1.5">
          <History class="w-3 h-3"></History>
        </button>
        搜索历史
      </Badge>
      <Badge variant="outline" class="select-none mr-4">
        <button @click="clearHistory">
          <Trash2 class="w-3 h-3"></Trash2>
        </button>
      </Badge>
      <span v-for="(item, index) in searchHistory" :key="index" class="mr-4">
        <button @click="search(item)" class="mr-3">
          {{ item }}
        </button>
        <button @click="removeHistoryItem(index)">
          <XCircle class="w-3 h-3 mr-4"></XCircle>
        </button>
      </span>
    </div>
    <div class="mt-4 flex gap-4">
      <ClientOnly>
        <p>
          <Badge variant="outline" class="select-none">
            <button class="mr-1.5">
              <Sparkles class="w-3 h-3"></Sparkles>
            </button>
            试一试吧 </Badge
          >&nbsp;
          <span v-for="(title, idx) in random(examples)" :key="title"
            >{{ idx > 0 ? '&nbsp;|&nbsp; ' : ''
            }}<span
              class="color-blue-400 hover:color-blue-500 cursor-pointer"
              @click="search(title)"
              >{{ title }}</span
            ></span
          >
        </p>
        <template #fallback>
          <p class="w-full h-[1.5em]"></p>
        </template>
      </ClientOnly>
    </div>
    <div class="w-full mt-6 pb-16">
      <div v-if="isSearching" class="w-full"><CircleDashed class="w-10 h-10 animate-spin" /></div>
      <div v-else-if="details?.details || details?.subject">
        <BangumiResult
          v-if="details.subject"
          :input="searchInput"
          :subject="details.subject"
          :persons="details.persons"
        ></BangumiResult>
        <div v-else class="flex">
          <Card class="w-full mb-6">
            <CardContent class="p-6">
              <span class="text-2xl font-bold">貌似在 Bangumi 番组计划 没有找到作品详情。</span>
              <br />如果你搜索的并不是一部具体的「作品」，或者下方的商家搜索结果已按预期输出，请忽略本提示。
              <br />如果你搜索的作品在 Bangumi 番组计划存在，但仍然弹出这个提示，您可以<a
                href="https://github.com/YurierDept/get-bonus/issues"
                target="_blank"
                class="color-blue"
                >提交 Issue</a
              >。
            </CardContent>
          </Card>
        </div>
        <SearchResult
          v-if="details?.details && foundNums > 0"
          :details="details.details"
        ></SearchResult>
        <div v-else>
          <Card class="w-full mb-6">
            <CardContent class="p-6">
              <span class="text-2xl font-bold"
                ><AlertCircle /> 已在目前支持的所有商家都搜索了一次，但貌似找不到商品。</span
              >
              <br />
              1. 请先确认您在搜索框输入的是商品（书籍等）的<span class="font-bold"
                >原文（例如：日文）标题</span
              >，且输入准确无误、不是简称。 <br />如果您输入的是中文译名，您应该可以在此段文字上方的
              Bangumi 番组计划 信息卡片，一键复制原文标题，重新进行搜索。如果上方来自 Bangumi
              番组计划 的结果有误，请自行找到正确的原文标题。
              <br />
              2. 尝试调整搜索设置。
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
      </div>
      <div v-else-if="details && foundNums === 0">
        <Card class="w-full mb-6">
          <CardContent class="p-6">
            <span class="text-2xl font-bold">
              <AlertCircle />
              没有搜索结果。</span
            ><br />
            无法在 Bangumi 番组计划 与所有支持的商家找到任何符合搜索关键词的作品与商品。
            <br />
            1. 请先确认您在搜索框输入的是商品（书籍等）的<span class="font-bold"
              >原文（例如：日文）标题</span
            >，且输入准确无误、不是简称。<br />
            如果您输入的是中文译名，想用中文译名来查原文（例如：日文）标题，请注意您输入的中文译名需要完整、输入准确无误，<span
              class="font-bold"
              >同样不能是简称</span
            >。
            <br />
            2. 尝试调整搜索设置。
            <br />
            3. 尝试只输入作品名称，或是商品名称当中较为关键的词语；搜索书籍可删去 第X卷 / X 巻
            等卷数表述，改用半角数字（如：0 1 ……），或不带卷数搜索。
            <br />
            4.
            如果您访问本站的网络连接欠佳，可能也无法正常进行搜索并弹出本提示。请自行解决此类问题。
            <br />
            5. 如果您已阅读上述提示并都尝试过，但仍然无法解决问题（例如：使用相同关键词在 Bangumi
            番组计划 或支持的商家可以搜到商品，但这里无法搜到），请
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
      <div v-else>
        <UsageHelp></UsageHelp>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<style>
.main {
  @apply: mx-auto xl:w-5xl lg:w-3xl md:w-2xl lt-md:w-[95vw] lt-md:px-3 lt-sm:w-[100vw];
}
</style>
