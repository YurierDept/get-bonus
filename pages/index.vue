<script setup lang="ts">
import type { Detail } from 'get-bonus';
import type { SubjectInformation, SubjectPersons, PersonInformation } from 'bgmc';
import { Loader2, Search } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

const { data } = await useAsyncData('search_results', async () =>
  route.query.q
    ? Promise.all([$fetch(`/api/search/${route.query.q}`), $fetch(`/api/bgm/${route.query.q}`, {})])
    : undefined
);

type FullDetail = {
  details: Record<string, Detail[]> | null;
  subject: SubjectInformation | null;
  persons: Array<SubjectPersons[0] & { detail: PersonInformation }> | null;
};

const details = ref<FullDetail | null>(
  data.value
    ? {
        details: data.value[0].details,
        subject: data.value[1]?.subject,
        persons: data.value[1]?.persons
      }
    : null
);

let abort: AbortController | null = null;
const searchInput = ref((route.query.q as string | null) || '');
const isSearching = ref(false);
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
  }
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
  'ぼっち・ざ・ろっく！',
  'はなにあらし',
  '春とみどり',
  'ご注文はうさぎですか？',
  '転生王女と天才令嬢の魔法革命',
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
    <div class="mt-10 select-none cursor-pointer" @click="resetSearch">
      <span class="text-4xl font-bold">百合花船·特典搜索<sup>Beta</sup></span>
    </div>
    <div class="mt-8 flex gap-4">
      <Input
        v-model="searchInput"
        @keydown.enter="search(searchInput)"
        placeholder="在搜索前，请注意查看使用说明"
      ></Input>
      <Button @click="search(searchInput)" :disabled="isSearching">
        <Loader2 v-if="isSearching" class="w-4 h-4 mr-2 animate-spin" />
        <Search v-else class="w-4 h-4 mr-2"></Search>
        <span>搜索</span>
      </Button>
    </div>
    <div class="mt-4 flex gap-4">
      <ClientOnly>
            <p>
              试一试吧：
              <span v-for="(title, idx) in random(examples)" :key="title"
                >{{ idx > 0 ? '、' : ''
                }}<span
                  class="color-blue-400 hover:color-blue-500 cursor-pointer"
                  @click="search(title)"
                  >{{ title }}</span
                ></span
              >
            </p>
      </ClientOnly>
    </div>
    <div class="w-full mt-6 pb-16">
      <div v-if="isSearching" class="w-full"><Skeleton class="h-60 w-full"></Skeleton></div>
      <div v-else-if="details?.details || details?.subject">
        <BangumiResult
          v-if="details.subject"
          :input="searchInput"
          :subject="details.subject"
          :persons="details.persons"
        ></BangumiResult>
        <div v-else class="flex">
          <span class="text-2xl font-bold">貌似在 Bangumi 番组计划 没有找到作品详情。</span>
          <br/>如果你搜索的并不是一部具体的「作品」，或者下方的商家搜索结果已按预期输出，请忽略本提示。
          <br/>如果你搜索的作品在 Bangumi 番组计划存在，但仍然弹出这个提示，您可以<a href="https://github.com/YurierDept/get-bonus/issues" target="_blank" class="color-blue">提交 Issue</a>。
        </div>
        <SearchResult
          v-if="details?.details && foundNums > 0"
          :details="details.details"
        ></SearchResult>
        <div v-else>
          <span class="text-2xl font-bold">已在目前支持的所有商家都搜索了一次，但貌似找不到商品。</span>
          <br/>
          1. 请先确认您在搜索框输入的是商品（书籍等）的<span class="font-bold">原文（例如：日文）标题</span>，且输入准确无误、不是简称。
          <br/>如果您输入的是中文译名，您应该可以在此段文字上方的 Bangumi 番组计划 信息卡片，一键复制原文标题，重新进行搜索。如果上方来自 Bangumi 番组计划 的结果有误，请自行找到正确的原文标题。
          <br/>
          2. 尝试调整搜索设置。
          <br/>
          3. 尝试只输入作品名称，或是商品名称当中较为关键的词语；搜索书籍可删去 第X卷 /  X 巻 等卷数表述，改用半角数字（如：0 1 ……），或不带卷数搜索。
          <br/>
          4. 如果您访问本站的网络连接欠佳，可能也无法正常进行搜索并弹出本提示。请自行解决此类问题。
          <br/>
          5. 如果您已阅读上述提示并都尝试过，但仍然无法解决问题，请 <a href="https://github.com/YurierDept/get-bonus/issues" target="_blank" class="color-blue">提交 Issue</a> 给开发者，开发者会协助解决。
        </div>
      </div>
      <div v-else-if="details && foundNums === 0">
        <span class="text-2xl font-bold">没有搜索结果。</span><br/>
        无法在 Bangumi 番组计划 与所有支持的商家找到任何符合搜索关键词的作品与商品。
          <br/>
          1. 请先确认您在搜索框输入的是商品（书籍等）的<span class="font-bold">原文（例如：日文）标题</span>，且输入准确无误、不是简称。<br/>
          如果您输入的是中文译名，想用中文译名来查原文（例如：日文）标题，请注意您输入的中文译名需要完整、输入准确无误，<span class="font-bold">同样不能是简称</span>。
          <br/>
          2. 尝试调整搜索设置。
          <br/>
          3. 尝试只输入作品名称，或是商品名称当中较为关键的词语；搜索书籍可删去 第X卷 /  X 巻 等卷数表述，改用半角数字（如：0 1 ……），或不带卷数搜索。
          <br/>
          4. 如果您访问本站的网络连接欠佳，可能也无法正常进行搜索并弹出本提示。请自行解决此类问题。
          <br/>
          5. 如果您已阅读上述提示并都尝试过，但仍然无法解决问题（例如：使用相同关键词在 Bangumi 番组计划 或支持的商家可以搜到商品，但这里无法搜到），请 <a href="https://github.com/YurierDept/get-bonus/issues" target="_blank" class="color-blue">提交 Issue</a> 给开发者，开发者会协助解决。
      </div>
      <div v-else>
        <div class="mt-6 rounded-4 p-6 b-1 space-y-3">
          <p class="[&>a]:underline underline-dotted [&>a:hover]:color-blue">
            <span class="font-bold">尚在开发，现开放试用。</span>反馈 Bug 与 提出意见与建议：<a href="https://github.com/YurierDept/get-bonus/issues" target="_blank" class="color-blue">提交 Issue</a> 或 <a href="mailto:harico@yurier.net" target="_blank">发邮件给主编</a>
            <br/>
            <span class="font-bold">使用说明：</span><br/>
            <span class="font-bold">1.</span> 输入商品（书籍等）的<span class="font-bold">原文（例如：日文）标题</span>，以查询商品在各商家的商品及特典信息，现支持<a href="https://www.melonbooks.co.jp" target="_blank">Melonbooks</a>、
            <a href="https://www.animate.co.jp/">Animate</a>、
            <a href="https://ecs.toranoana.jp" target="_blank">虎穴</a>、
            <a href="https://www.gamers.co.jp" target="_blank">Gamers</a>、
            <a href="https://shop.comiczin.jp" target="_blank">Comic Zin</a>、
            <a href="https://www.mangaoh.co.jp" target="_blank">漫画王</a>。
            <br/>
            想搜索书籍的指定卷数时，可用「作品日文标题+空格+卷数半角数字」的格式搜索，如「このはな綺譚 15」；不要输入全角数字或带圆圈的数字，数字后不必加上 卷/巻 。
            <br/>
            <span class="font-bold">2. </span>输入作品的<span class="font-bold">中文译名</span> （不能是简称），以查询作品的<span class="font-bold">原文（例如：日文）标题</span>并复制。
          </p>
          <p class="[&>a]:underline underline-dotted [&>a:hover]:color-blue">
          推荐使用 Chrome / Edge / Firefox / Safari 等浏览器访问。个别功能在内核较旧的浏览器（比如部分 由中国大陆的公司开发 的 App 或浏览器）可能无法按预期运行。
          <br/>
          所有图片仅为展示与传达信息，其版权均归原作者；搜索结果与提示仅供参考，请以商家分发特典的实际策略与结果为准。
          <br/>
          本程序在搜索时（除「试一试吧」模块）不可能也不会只展现百合作品（百合作品繁多，每人的标准也不同），请按需搜索具体作品。
          <br/>
            本项目已在
            <a href="https://github.com/YurierDept/get-bonus/" target="_blank">GitHub</a> 开源。
            Proudly Developed by
            <a href="https://yurier.net/about#yurier-dev" target="_blank">Yurier Dev</a>.
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
