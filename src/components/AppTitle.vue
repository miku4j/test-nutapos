<template>
  <component
    :is="level === 1 ? 'h1' : 'h2'"
    class="font-semibold"
    :class="level === 1
      ? 'text-xl md:text-2xl lg:text-3xl'
      : 'text-lg md:text-xl lg:text-2xl'"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
  defineProps<{ level?: 1 | 2 }>()
</script>
