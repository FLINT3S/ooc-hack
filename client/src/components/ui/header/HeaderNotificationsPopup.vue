<template>
    <n-popover
            placement="bottom-end"
            style="max-width: 400px; overflow-y: auto"
            trigger="click"
            :show-arrow="false"
    >
        <template #trigger>
            <n-badge :offset="[-5, 5]" :show="unread" dot>
                <NotificationsOutlined class="header-icon me-3" width="26"/>
            </n-badge>
        </template>

        <n-scrollbar style="max-height: 300px">
            <n-list>
                <n-list-item v-for="_ in 5">
                    <n-thing>
                        Изменён статус объекта “г. Москва, ул. Беловежская, вл.4” на Завершено

                        <template #footer>
                        <span style="color: var(--text-secondary)">
                            05.04.23 08:10
                        </span>
                        </template>
                    </n-thing>
                </n-list-item>
            </n-list>
        </n-scrollbar>
    </n-popover>
</template>

<script lang="ts" setup>
import {NotificationsOutlined} from "@vicons/material";

interface Props {
    unread?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    unread: false
})
</script>

<style scoped>
</style>