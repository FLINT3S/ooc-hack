<template>
    <router-link :to="to" class="d-flex menu-link header-icon">
        <slot></slot>
        <p class="my-0 ms-2 title">{{ title }}</p>
    </router-link>
</template>

<script lang="ts" setup>
interface Props {
    to: string,
    title: string
}

const props = defineProps<Props>()
</script>

<style scoped>
.menu-link {
    color: var(--text-tethritary);
    text-decoration: none;
}

.menu-link .title {
    color: var(--text-secondary)
}
</style>