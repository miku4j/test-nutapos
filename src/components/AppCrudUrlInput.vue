<template>
  <v-menu v-model="menuOpen" :close-on-content-click="false">
    <template #activator="{ props: activatorProps }">
      <v-text-field
        v-bind="activatorProps"
        :append-inner-icon="menuOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        class="md:min-w-sm"
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
        label="URL CRUDCRUD.COM"
        variant="outlined"
      />

      <p class="text-xs opacity-50 mt-1">
        Example: https://crudcrud.com/api/ff69fc6f98634e39be6da892de89d8e5
      </p>

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
