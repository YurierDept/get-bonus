<script setup lang="ts">
import './utils/info';
import { Toaster } from '@/components/ui/sonner';
</script>

<template>
  <Script type="text/javascript">
    (function (c, l, a, r, i, t, y) { c[a] = c[a] || function () { (c[a].q = c[a].q ||
    []).push(arguments); }; t = l.createElement(r); t.async = 1; t.src =
    'https://www.clarity.ms/tag/' + i; y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y); })(window, document, 'clarity', 'script', 'kw32lgez2o');
  </Script>
  <Toaster richColors position="top-center"/>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>
