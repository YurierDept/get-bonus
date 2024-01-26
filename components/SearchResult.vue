<script setup lang="ts">
import type { Detail } from 'get-bonus';

const props = defineProps<{ details: Record<string, Detail[]> }>();

const detailEntries = computed(() => {
  return Object.entries(props.details).filter((d) => d[1].length > 0);
});
</script>

<template>
  <Accordion type="multiple" :default-value="detailEntries.map((d) => d[0])">
    <AccordionItem v-for="[id, results] in detailEntries" :key="id" :value="id">
      <AccordionTrigger>{{ id }}</AccordionTrigger>
      <AccordionContent>
        <ul class="grid gap-4">
          <ResultItem v-for="result in results" :key="result.url" :data="result" />
        </ul>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
