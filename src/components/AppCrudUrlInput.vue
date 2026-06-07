<template>
  <v-menu v-model="menuOpen" :close-on-content-click="false">
    <template #activator="{ props: activatorProps }">
      <v-text-field
        v-bind="activatorProps"
        :append-inner-icon="menuOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        class="md:max-w-sm"
        hide-details
        :model-value="modelValue"
        placeholder="Masukkan URL CRUD..."
        prepend-inner-icon="mdi-link-variant"
        readonly
        rounded="12"
        variant="outlined"
      />
    </template>

    <v-card class="p-4 rounded-xl" min-width="300">
      <v-text-field
        v-model="urlInput"
        autofocus
        hide-details
        label="URL CRUD"
        variant="outlined"
      />

      <AppButton
        class="mt-2 w-full"
        :disabled="!urlInput"
        @click="submit"
      >
        Simpan
      </AppButton>
    </v-card>
  </v-menu>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import AppButton from './AppButton.vue'

  const props = defineProps<{ modelValue: string }>()
  const emit = defineEmits<{ 'update:model-value': [value: string] }>()

  const menuOpen = ref(false)
  const urlInput = ref(props.modelValue)

  function submit () {
    emit('update:model-value', urlInput.value)
    menuOpen.value = false
  }
</script>
