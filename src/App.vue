<template>
  <v-app>
    <v-main class="m-4">
      <div class="flex flex-col gap-3 h-full">
        <app-title>Daftar Diskon</app-title>

        <app-select v-model="selectedShop" hide-details :items="shops" prepend-inner-icon="mdi-store" />

        <app-box class="flex flex-col justify-center items-center gap-2 h-full">
          <img alt="No discount" :src="noDiscount" width="240">
          <app-title class="mt-2" :level="2">Belum Ada Diskon</app-title>
          <p class="text-center">Silahkan tambah diskon untuk menarik pelanggan dan meningkatakan penjualan.</p>
          <AppButton prepend-icon="mdi-plus">Tambah Diskon</AppButton>
        </app-box>
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import noDiscount from './assets/no-discount.png'
  import AppBox from './components/AppBox.vue'
  import AppButton from './components/AppButton.vue'
  import AppSelect from './components/AppSelect.vue'
  import AppTitle from './components/AppTitle.vue'

  const shops = [
    'Kopi Anak Bangsa',
    'Kopi Anak Putih',
    'Kopi Anak Merah',
  ]
  const selectedShop = ref(shops[0])
</script>
