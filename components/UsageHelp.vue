<script setup lang="ts">
import { BookCheck, Bug, Compass, Info, PackageOpen } from 'lucide-vue-next';
</script>

<template>
  <div
    class="mt-6 rounded-4 p-6 b-1 space-y-3 [&_a]:(underline underline-dotted underline-offset-4) [&_a:hover]:color-blue"
  >
    <p>
      <Badge component="span" variant="outline" class="select-none mr-1">
        <button class="mr-1.5">
          <BookCheck class="w-3 h-3"></BookCheck>
        </button>
        使用方法
      </Badge>
      <span class="font-bold">1. 欲查询商品在各商家的商品及特典信息，请输入</span
      ><span>商品（书籍等）的</span><span class="font-bold">原文标题</span
      ><span
        >（例如：星屑テレパス）；如果是书籍，也可以加上卷数（需为半角数字，不要输入全角数字或带圆圈的数字，数字后不必加上
        卷/巻；例如：このはな綺譚 15 ）。</span
      >
    </p>
    <p>
      <span class="font-bold">现已支持 </span>
      <a href="https://www.melonbooks.co.jp" target="_blank">Melonbooks</a>、
      <a href="https://www.animate.co.jp/">Animate</a>、
      <a href="https://ecs.toranoana.jp" target="_blank">虎穴</a>、
      <a href="https://www.gamers.co.jp" target="_blank">Gamers</a>、
      <a href="https://shop.comiczin.jp" target="_blank">Comic Zin</a>、
      <a href="https://www.mangaoh.co.jp" target="_blank">漫画王</a> 等店铺。
    </p>
    <p>
      <span class="font-bold">2. 欲查询作品的原文标题并复制，请输入作品的中文译名</span
      ><span>。不能是简称。</span>
    </p>
    <p>
      <Badge component="span" variant="outline" class="select-none mr-1">
        <button class="mr-1.5">
          <Bug class="w-3 h-3"></Bug>
        </button>
        反馈Bug·提建议
      </Badge>
      <a href="https://github.com/YurierDept/get-bonus/issues" target="_blank" color="#45c2ff"
        >提交 Issue</a
      >
      或 <a href="mailto:harico@yurier.net" target="_blank">发邮件给主编</a>。
    </p>
    <p>
      <Badge component="span" variant="outline" class="select-none mr-1">
        <button class="mr-1.5">
          <Compass class="w-3 h-3"></Compass>
        </button>
        关于浏览器的说明
      </Badge>
      <span
        >推荐使用 Chrome / Edge / Firefox / Safari 等。部分 由中国大陆的公司开发 的
        App或浏览器，其内核可能较旧，可能使本项目的部分功能/特性失效。</span
      >
    </p>
    <p>
      <Badge component="span" variant="outline" class="select-none mr-1">
        <button class="mr-1.5">
          <Info class="w-3 h-3"></Info>
        </button>
        其他说明与声明
      </Badge>
      <span
        >所有信息仅供参考。 搜索结果由 Bangumi 番组计划 及已支持的商家网站解析而来，<span
          class="underline underline-offset-4"
          >未做主观筛选</span
        >， 请理性看待搜索结果；提示由
      </span>
      <a
        href="https://github.com/YurierDept/get-bonus/graphs/contributors"
        target="_blank"
        color="#45c2ff"
      >
        本项目的贡献者
      </a>
      与其他同好撰写； 各商家对各自的特典信息与特典发放行为有最终解释权；
      特典图片仅用于展示与传达信息，其版权均归原作者；价格标签会标注货币单位，其中「円」为日元。
    </p>
    <p>
      <Badge component="span" variant="outline" class="select-none mr-1">
        <button class="mr-1.5">
          <PackageOpen class="w-3 h-3"></PackageOpen>
        </button>
        开发者与开源信息
      </Badge>
      <span>
        「百合花船·特典搜索」项目由
        <a href="https://yurier.net/about#yurier-dev" target="_blank" color="#45c2ff">
          Yurier Dev
        </a>
        (<a href="https://yurier.net/" target="_blank" color="#45c2ff"> 百合研社团 </a>开发小组 )
        创建与做出主要贡献。
        <a href="https://github.com/YurierDept/get-bonus/" target="_blank" color="#45c2ff">
          已在 GitHub 开源 →
        </a>
      </span>
    </p>
  </div>
</template>
