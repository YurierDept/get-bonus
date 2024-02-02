<script setup lang="ts">
import type { SubjectInformation } from 'bgmc';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

const props = defineProps<{ subject: SubjectInformation }>();
</script>

<template>
  <Card class="w-full mb-6">
    <CardHeader>
      <CardTitle>
        <a :href="`https://bgm.tv/subject/${subject.id}`" class="hover:color-blue">{{
          subject.name_cn || subject.name
        }}</a>
      </CardTitle>
      <CardDescription class="mt-2">
        <span>Bgm ID: </span>
        <a :href="`https://bgm.tv/subject/${subject.id}`" class="hover:color-blue">{{
          subject.id
        }}</a>
      </CardDescription>
    </CardHeader>
    <CardContent class="flex gap-4">
      <div><NuxtImg class="max-w-36" :src="subject.images.large" /></div>
      <div>
        <div class="text-sm">{{ subject.summary }}</div>
      </div>
    </CardContent>
    <!-- <CardFooter class="flex justify-between px-6 pb-6">
      <Button variant="outline"> Cancel </Button>
      <Button>Deploy</Button>
    </CardFooter> -->
  </Card>
</template>
