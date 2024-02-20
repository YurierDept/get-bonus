<script lang="ts" setup>
import { computed } from 'vue';

import VPSwitch from './VPSwitch.vue';

const colorMode = useColorMode();

const toggleAppearance = () => {
  if (colorMode.value === 'light') {
    colorMode.preference = 'dark';
  } else if (colorMode.value === 'dark') {
    colorMode.preference = 'light';
  }
};

const switchTitle = computed(() => {
  return colorMode.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
});
</script>

<template>
  <VPSwitch
    :title="switchTitle"
    class="VPSwitchAppearance"
    :aria-checked="colorMode.preference === 'dark'"
    @click="toggleAppearance"
  >
    <span class="vpi-sun sun" />
    <span class="vpi-moon moon" />
  </VPSwitch>
</template>

<style scoped>
.sun {
  opacity: 1;
}

.moon {
  opacity: 0;
}

.dark .sun {
  opacity: 0;
}

.dark .moon {
  opacity: 1;
}

.dark .VPSwitchAppearance :deep(.check) {
  /*rtl:ignore*/
  transform: translateX(18px);
}

[class^='vpi-'],
[class*=' vpi-'],
.vp-icon {
  width: 1em;
  height: 1em;
}
[class^='vpi-'].bg,
[class*=' vpi-'].bg,
.vp-icon.bg {
  background-size: 100% 100%;
  background-color: transparent;
}
[class^='vpi-']:not(.bg),
[class*=' vpi-']:not(.bg),
.vp-icon:not(.bg) {
  -webkit-mask: var(--icon) no-repeat;
  mask: var(--icon) no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  background-color: currentColor;
  color: inherit;
}

.vpi-sun {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Cpath d='M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41'/%3E%3C/svg%3E");
}
.vpi-moon {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'/%3E%3C/svg%3E");
}
</style>
