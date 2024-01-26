<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner';
</script>

<template>
  <Toaster />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>
