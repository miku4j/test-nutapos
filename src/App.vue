<template>
  <v-app>
    <v-main class="m-4">
      <div class="flex flex-col gap-3 h-full">
        <app-title>Daftar Diskon</app-title>

        <v-menu v-model="menuOpen" :close-on-content-click="false">
          <template #activator="{ props }">
            <v-text-field
              v-bind="props"
              hide-details
              :model-value="selectedShop"
              placeholder="Pilih atau tambah toko..."
              prepend-inner-icon="mdi-store"
              readonly
              rounded="12"
              variant="outlined"
            />
          </template>

          <v-card class="p-4" min-width="300">
            <v-text-field
              v-model="newShop"
              autofocus
              hide-details
              label="API CRUD"
              variant="outlined"
            />

            <AppButton
              class="mt-2 w-full"
              :disabled="!newShop"
              @click="selectedShop = newShop; menuOpen = false"
            >
              Simpan
            </AppButton>
          </v-card>
        </v-menu>

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
  import AppTitle from './components/AppTitle.vue'

  const menuOpen = ref(false)
  const newShop = ref('crudcrud')
  const selectedShop = ref('crudcrud')
</script>
