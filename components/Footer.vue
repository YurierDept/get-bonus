<script setup lang="ts">
// See https://github.com/yjl9903/unplugin-info?tab=readme-ov-file#usage
import buildTime from '~build/time';
import { sha } from '~build/git';
import { version } from '~build/package';

import { format } from '@formkit/tempo';
import { Milestone, Clock3, Sparkles } from 'lucide-vue-next';
</script>

<template>
  <footer class="space-y-2 mb-10 text-sm text-center text-base-500">
    <p>
      <Milestone class="inline align-baseline w-3 h-3 mr-1"></Milestone>
      <span
        >程序版本号: {{ version }} (<a
          :href="`https://github.com/YurierDept/get-bonus/tree/${sha}`"
          target="_blank"
          class="hover:text-[#45c2ff]"
          >{{ sha.slice(0, 6) }}</a
        >)</span
      >
    </p>
    <p>
      <Clock3 class="inline align-baseline w-3 h-3 mr-1"></Clock3>
      <span
        >程序构建于:
        {{
          format({
            date: buildTime,
            format: 'YYYY-MM-DD HH:mm',
            tz: 'Asia/Shanghai'
          })
        }}</span
      >
    </p>
    <p>
      <Sparkles class="inline align-baseline w-3 h-3 mr-1"></Sparkles>
      <span>
        <span>「百合花船·特典搜索」项目是</span
        ><a
          href="https://yurier.net/projects#%E6%9C%8D%E5%8A%A1-%E3%80%8C%E7%99%BE%E5%90%88%E8%8A%B1%E8%88%B9%E3%80%8D%E4%BC%81%E5%88%92"
          target="_blank"
          color="#45c2ff"
          >「百合花船」企划</a
        ><span> 的一部分。</span>
      </span>
    </p>
  </footer>
</template>
