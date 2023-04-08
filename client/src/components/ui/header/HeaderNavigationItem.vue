<template>
  <router-link :to="to" class="d-flex">
      <slot></slot>
      <p class="my-0 ms-2">{{title}}</p>
  </router-link>
</template>

<script setup lang="ts">
interface Props {
    to: string,
    title: string
}

const props = defineProps<Props>()
</script>

<style scoped>

</style>