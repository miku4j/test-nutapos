<template>
  <app-box class="flex flex-col justify-center items-center gap-2 h-full">
    <img alt="No discount" :src="noDiscount" width="240">
    <app-title class="mt-2" :level="2">Belum Ada Diskon</app-title>
    <p class="text-center">Silahkan tambah diskon untuk menarik pelanggan dan meningkatakan penjualan.</p>
    <AppButton prepend-icon="mdi-plus" @click="$emit('create')">Tambah Diskon</AppButton>
  </app-box>
</template>

<script lang="ts" setup>
  import noDiscount from '../assets/no-discount.png'
  import AppBox from './AppBox.vue'
  import AppButton from './AppButton.vue'
  import AppTitle from './AppTitle.vue'

  defineEmits<{ create: [] }>()
</script>
