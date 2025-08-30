<template>
  <component
    :is="IconComponent || Icons.Placeholder"
    v-bind="$attrs"
    :size="props.size"
    :color="props.color"
    :opacity="props.opacity"
  />
  
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as Icons from '../icons';
import type { PapiconsProps } from '../types/PapiconsProps';
import type { IconNames } from '../icons';

const props = defineProps<{ name: IconNames | string } & PapiconsProps>();

const IconComponent = computed(() => {
  const target = String(props.name).toLowerCase();
  const found = Object.entries(Icons).find(([key]) => key.toLowerCase() === target)?.[1] as any;
  return found;
});
</script>


