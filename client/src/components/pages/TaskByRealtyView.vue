<template>
  <div>
      {{routeParam}}
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const routeParam = route?.params?.realtyId
</script>

<style scoped>

</style>