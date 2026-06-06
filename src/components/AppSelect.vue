<template>
  <v-select rounded="12" variant="outlined" v-bind="$attrs">
    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </v-select>
</template>
