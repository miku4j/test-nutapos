<template>
  <v-app>
    <v-main class="p-4 bg-surface">
      <div class="flex flex-col gap-3 h-full">
        <div class="flex justify-between items-center">
          <app-title>Daftar Diskon</app-title>

          <div v-if="hasData" class="flex gap-2">
            <AppButton
              v-if="selected.length === 0"
              prepend-icon="mdi-plus"
              @click="openCreateDialog"
            >
              Tambah Diskon
            </AppButton>

            <template v-else>
              <v-btn
                class="px-6"
                color="error"
                rounded="pill"
                variant="outlined"
                @click="selected = []"
              >
                Batalkan
              </v-btn>

              <AppButton color="error" @click="showDeleteConfirm = true">
                Hapus
              </AppButton>
            </template>
          </div>
        </div>

        <div v-if="hasData" class="flex flex-col gap-2 md:items-end md:flex-row">
          <div>
            <v-text-field
              v-model="search"
              class="flex-1 md:min-w-sm"
              hide-details
              placeholder="Cari diskon..."
              prepend-inner-icon="mdi-magnify"
              rounded="12"
              variant="outlined"
            />

          </div>

          <div class="md:max-w-sm">
            <AppCrudUrlInput v-model="crudUrl" />
          </div>

          <div class="grow" />
        </div>

        <div v-else class="flex md:self-start">
          <AppCrudUrlInput v-model="crudUrl" />
        </div>

        <div v-if="crudUrl && !hasData && crud.loading.value" class="flex grow justify-center pa-4">
          <v-progress-circular indeterminate />
        </div>

        <AppEmptyState
          v-if="!hasData && !crud.loading.value"
          :disable-add="!crudUrl"
          @create="openCreateDialog"
        />

        <template v-if="crudUrl && hasData">
          <v-data-table
            v-model="selected"
            class="rounded-xl"
            :headers="tableHeaders"
            item-value="_id"
            :items="discountsList"
            :loading="crud.loading.value"
            show-select
            style="border: thin solid rgba(var(--v-border-color), var(--v-border-opacity))"
          >
            <template #item.value="{ item }">
              {{ formatDiscountValue(item.value, item.type) }}
            </template>

            <template #item.actions="{ item }">
              <AppButton size="small" variant="text" @click="openEditDialog(item)">
                <v-icon>mdi-pencil</v-icon>
              </AppButton>
            </template>
          </v-data-table>
        </template>

        <v-dialog v-model="showDialog" :persistent="false">
          <div v-click-outside="() => showDialog = false" class="bg-background p-6 pt-4 rounded-3xl flex flex-col gap-4 w-full lg:w-lg mx-auto">
            <div class="mb-2 flex justify-between items-center">
              <span class="font-semibold text-xl">
                {{ editingItem ? 'Ubah Diskon' : 'Tambah Diskon' }}
              </span>

              <v-btn icon="mdi-close" size="small" variant="text" @click="showDialog = false" />
            </div>

            <v-form ref="formRef" class="flex flex-col gap-4" @submit.prevent="submit">
              <v-text-field
                ref="nameField"
                v-model="discountName"
                :append-inner-icon="nameErrorMsg ? 'mdi-alert-circle' : undefined"
                :error-messages="nameErrorMsg ? [nameErrorMsg] : undefined"
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
                  :append-inner-icon="!discountValueDisplay ? undefined : valueError ? 'mdi-alert-circle' : undefined"
                  class="flex-1"
                  hide-details="auto"
                  label="Diskon"
                  :model-value="discountValueDisplay"
                  :prefix="discountType === 'amount' ? 'Rp' : undefined"
                  rounded="12"
                  :rules="valueRules"
                  :suffix="discountType === 'percentage' ? '%' : undefined"
                  type="text"
                  variant="outlined"
                  @update:model-value="onDiscountValueUpdate"
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

              <div class="mt-2 w-full flex justify-between">
                <AppButton
                  v-if="editingItem"
                  color="error"
                  variant="text"
                  @click="confirmDeleteFromEdit"
                >
                  Hapus
                </AppButton>

                <AppButton
                  :class="{
                    'w-full': !editingItem
                  }"
                  :disabled="nameError || valueError || saving"
                  :loading="saving"
                  type="submit"
                >
                  {{ editingItem ? 'Perbarui' : 'Simpan' }}
                </AppButton>

              </div>
            </v-form>
          </div>
        </v-dialog>

        <v-dialog v-model="showDeleteConfirm">
          <div v-click-outside="() => showDeleteConfirm = false" class="bg-background p-6 pt-4 rounded-3xl flex flex-col gap-4 lg:w-lg mx-auto">
            <div class="mb-2 flex justify-between items-center">
              <span class="font-semibold text-xl">
                Hapus Diskon
              </span>

              <v-btn icon="mdi-close" size="small" variant="text" @click="showDeleteConfirm = false" />
            </div>

            <div>
              <p>Apakah Anda yakin ingin menghapus diskon yang dipilih?</p>

              <ul class="flex flex-col gap-2 list-disc list-inside">
                <li>Diskon yang dihapus tidak bisa dikembalikan lagi.</li>
              </ul>
            </div>

            <div class="flex gap-2 justify-end">
              <v-btn
                class="px-6"
                color="error"
                rounded="pill"
                variant="outlined"
                @click="showDeleteConfirm = false"
              >Batalkan</v-btn>

              <AppButton class="px-6" color="error" @click="confirmBulkDelete">Hapus</AppButton>

            </div>
          </div>
        </v-dialog>
      </div>

      <v-snackbar
        v-model="showSnackbar"
        color="#046B5F"
        location="top center"
        timeout="3000"
      >
        {{ snackbarMessage }}
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { computed, nextTick, ref, watch } from 'vue'
  import AppButton from './components/AppButton.vue'
  import AppCrudUrlInput from './components/AppCrudUrlInput.vue'
  import AppEmptyState from './components/AppEmptyState.vue'
  import AppTitle from './components/AppTitle.vue'
  import { type Discount, useDiscount } from './composables/useDiscount'
  import { currencyFormat, formatDiscountValue } from './utils/format'

  const crudUrl = ref('')
  const crud = useDiscount(crudUrl)

  const search = ref('')
  const selected = ref<string[]>([])

  const showDialog = ref(false)
  const editingItem = ref<Discount | null>(null)

  const discountName = ref('')
  const discountValue = ref<number | null>(null)
  const nameErrorMsg = ref('')

  watch(discountName, () => {
    nameErrorMsg.value = ''
  })
  const discountType = ref<'percentage' | 'amount'>('percentage')
  const formRef = ref<any>(null)

  const discountValueDisplay = computed(() => {
    if (discountValue.value === null) return ''
    return currencyFormat.format(discountValue.value)
  })

  function onDiscountValueUpdate (val: string | null) {
    const cleaned = (val ?? '').replace(/[^0-9]/g, '')
    discountValue.value = cleaned ? Number(cleaned) : null
  }
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

  function parseDisplayValue (v: string): number | null {
    const cleaned = v.replace(/[^0-9]/g, '')
    return cleaned ? Number(cleaned) : null
  }

  const valueRules = [
    (v: string) => parseDisplayValue(v) != null || 'Diskon tidak boleh kosong.',
    (v: string) => {
      const num = parseDisplayValue(v)
      return num == null || num > 0 || 'Nilai harus lebih dari 0'
    },
    (v: string) => {
      const num = parseDisplayValue(v)
      if (num == null) return true
      const max = discountType.value === 'percentage' ? 100 : 10_000_000
      const msg = discountType.value === 'percentage' ? 'Maksimal 100%' : 'Maksimal Rp 10.000.000'
      return num <= max || msg
    },
  ]

  const tableHeaders = [
    { title: 'Nama Diskon', key: 'name' },
    { title: 'Nilai Diskon', key: 'value' },
    { key: 'actions', sortable: false, align: 'end' },
  ] as const

  const hasData = computed(() => crud.data.value.length > 0)

  const discountsList = computed(() => {
    if (!search.value) return crud.data.value
    const q = search.value.toLowerCase()
    return crud.data.value.filter(d => d.name.toLowerCase().includes(q))
  })

  watch(crudUrl, url => {
    if (url) {
      crud.list()
    }
  })

  const showSnackbar = ref(false)
  const snackbarMessage = ref('')
  function showToast (message: string) {
    snackbarMessage.value = message
    showSnackbar.value = true
  }

  function openCreateDialog () {
    editingItem.value = null
    discountName.value = ''
    discountValue.value = null
    discountType.value = 'percentage'
    showDialog.value = true
  }

  function openEditDialog (item: Discount) {
    editingItem.value = item
    discountName.value = item.name
    discountValue.value = item.value
    discountType.value = item.type
    showDialog.value = true
  }

  async function submit () {
    const { valid } = await formRef.value?.validate() ?? { valid: ref(false) }
    if (!valid) return

    const trimmedName = discountName.value.trim()
    const duplicate = crud.data.value.find(d => {
      if (editingItem.value && d._id === editingItem.value._id) return false
      return d.name.toLowerCase() === trimmedName.toLowerCase()
    })
    if (duplicate) {
      nameErrorMsg.value = 'Nama diskon sudah digunakan, silahkan gunakan nama lain.'
      await nextTick()
      nameField.value?.focus()
      return
    }

    saving.value = true
    try {
      const payload = {
        name: trimmedName,
        value: discountValue.value!,
        type: discountType.value,
      }
      if (editingItem.value) {
        await crud.update(editingItem.value._id!, payload)
        showToast(`Diskon "${editingItem.value.name}" berhasil diperbarui`)
      } else {
        await crud.create(payload)
        showToast(`Diskon "${trimmedName}" berhasil ditambahkan`)
      }
      showDialog.value = false
      formRef.value?.reset()
      discountName.value = ''
      discountValue.value = null
      discountType.value = 'percentage'
    } finally {
      saving.value = false
    }
  }

  const showDeleteConfirm = ref(false)

  async function confirmBulkDelete () {
    showDeleteConfirm.value = false
    saving.value = true
    try {
      const names = crud.data.value
        .filter(d => selected.value.includes(d._id!))
        .map(d => d.name)
      for (const id of selected.value) {
        await crud.remove(id)
      }
      selected.value = []
      const msg = names.length > 1
        ? `${names.length} diskon berhasil dihapus`
        : `Diskon "${names[0]}" berhasil dihapus`
      showToast(msg)
    } finally {
      saving.value = false
    }
  }

  function confirmDeleteFromEdit () {
    if (!editingItem.value?._id) return
    selected.value = [editingItem.value._id]
    showDialog.value = false
    showDeleteConfirm.value = true
  }
</script>

<style scoped>
.v-data-table :deep(thead) {
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
}
</style>
