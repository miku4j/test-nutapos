<template>
  <v-app>
    <v-main class="m-4">
      <div class="flex flex-col gap-3 h-full">
        <app-title>Daftar Diskon</app-title>

        <AppCrudUrlInput v-model="crudUrl" />

        <AppEmptyState @create="showDialog = true" />

        <v-dialog v-model="showDialog" :persistent="false">
          <div v-click-outside="() => showDialog = false" class="bg-background p-6 pt-4 rounded-3xl flex flex-col gap-4 lg:w-lg mx-auto">
            <div class="mb-2 flex justify-between items-center">
              <span class="font-semibold text-xl">
                Tambah Diskon
              </span>

              <v-btn icon="mdi-close" size="small" variant="text" @click="showDialog = false" />
            </div>

            <v-form ref="formRef" class="flex flex-col gap-4" @submit.prevent="submit">
              <v-text-field
                ref="nameField"
                v-model="discountName"
                :append-inner-icon="!discountName ? undefined : nameError ? 'mdi-alert-circle' : undefined"
                hide-details="auto"
                label="Nama Diskon"
                placeholder="Misal: Diskon opening, diskon akhir tahun"
                rounded="12"
                :rules="nameRules"
                variant="outlined"
              />

              <div class="flex items-center gap-2">
                <v-text-field
                  ref="valueField"
                  v-model="discountValue"
                  :append-inner-icon="!discountValue ? undefined : valueError ? 'mdi-alert-circle' : undefined"
                  class="flex-1"
                  hide-details="auto"
                  label="Diskon"
                  :prefix="discountType === 'amount' ? 'Rp' : undefined"
                  rounded="12"
                  :rules="valueRules"
                  :suffix="discountType === 'percentage' ? '%' : undefined"
                  type="number"
                  variant="outlined"
                />

                <v-btn-toggle
                  v-model="discountType"
                  color="primary"
                  density="compact"
                  divided
                  mandatory
                  rounded="lg"
                  variant="outlined"
                >
                  <v-btn color="primary" size="small" value="percentage">%</v-btn>
                  <v-btn color="primary" size="small" value="amount">Rp</v-btn>
                </v-btn-toggle>
              </div>

              <AppButton class="mt-2 w-full" :disabled="nameError || valueError || saving" :loading="saving" type="submit">Simpan</AppButton>
            </v-form>
          </div>
        </v-dialog>
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import AppButton from './components/AppButton.vue'
  import AppCrudUrlInput from './components/AppCrudUrlInput.vue'
  import AppEmptyState from './components/AppEmptyState.vue'
  import { useDiscount } from './composables/useDiscount'

  const crudUrl = ref('https://crudcrud.com/api/ff69fc6f98634e39be6da892de89d8e5')

  const crud = useDiscount(crudUrl.value)

  const showDialog = ref(false)
  const discountName = ref('')
  const discountValue = ref<number | null>(null)
  const discountType = ref<'percentage' | 'amount'>('percentage')
  const formRef = ref<any>(null)
  const saving = ref(false)

  const nameField = ref<any>(null)
  const valueField = ref<any>(null)
  const nameError = computed(() => nameField.value?.errorMessages?.length > 0)
  const valueError = computed(() => valueField.value?.errorMessages?.length > 0)

  const nameRules = [
    (v: string) => !!v?.trim() || 'Nama diskon tidak boleh kosong.',
    (v: string) => (v?.trim()?.length ?? 0) >= 3 || 'Minimal 3 karakter',
    (v: string) => (v?.trim()?.length ?? 0) <= 128 || 'Maximal 128 karakter',
  ]

  const valueRules = [
    (v: number | null) => v != null || 'Diskon tidak boleh kosong.',
    (v: number | null) => v == null || v > 0 || 'Nilai harus lebih dari 0',
    (v: number | null) => {
      if (v == null) return true
      const max = discountType.value === 'percentage' ? 100 : 10_000_000
      const msg = discountType.value === 'percentage' ? 'Maksimal 100%' : 'Maksimal Rp 10.000.000'
      return v <= max || msg
    },
  ]

  async function submit () {
    const { valid } = await formRef.value?.validate() ?? { valid: ref(false) }
    if (!valid) return

    saving.value = true
    try {
      await crud.create({
        name: discountName.value.trim(),
        value: discountValue.value!,
        type: discountType.value,
      })
      showDialog.value = false
      formRef.value?.reset()
      discountName.value = ''
      discountValue.value = null
      discountType.value = 'percentage'
    } finally {
      saving.value = false
    }
  }
</script>
