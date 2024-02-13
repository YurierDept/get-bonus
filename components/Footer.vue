<script setup lang="ts">
// See https://github.com/yjl9903/unplugin-info?tab=readme-ov-file#usage
import buildTime from '~build/time';
import { sha } from '~build/git';
import { version } from '~build/package';
import { Milestone, Clock3, Sparkles } from 'lucide-vue-next';
</script>

<template>
  <footer class="space-y-2 mb-10 text-sm text-center text-base-600">
    <p>
      <button>
        <Milestone class="w-3 h-3 ml-1"></Milestone>
      </button>
      程序版本号: {{ version }} ( {{ sha.slice(0, 6) }} )
    </p>
    <p>
      <button>
        <Clock3 class="w-3 h-3 ml-2"></Clock3>
      </button>
      程序构建于: {{ buildTime }}
    </p>
    <p>
      <button>
        <Sparkles class="w-3 h-3 ml-2"></Sparkles>
      </button>
      「百合花船·特典搜索」项目是
      <a
        href="https://yurier.net/projects#%E6%9C%8D%E5%8A%A1-%E3%80%8C%E7%99%BE%E5%90%88%E8%8A%B1%E8%88%B9%E3%80%8D%E4%BC%81%E5%88%92"
        target="_blank"
        color="#45c2ff"
        >「百合花船」企划</a
      >的一部分。
    </p>
  </footer>
</template>
