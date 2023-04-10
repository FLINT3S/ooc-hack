<template>
    <n-popover
            placement="bottom-end"
            style="max-width: 400px; overflow-y: auto"
            trigger="click"
            :show-arrow="false"
    >
        <template #trigger>
            <n-badge :offset="[-19, 5]" :show="true" dot>
                <NotificationsOutlined class="header-icon me-3" width="26"/>
            </n-badge>
        </template>

        <n-scrollbar style="max-height: 300px">
            <n-list>
                <n-list-item v-for="notif in notificationStore.notifications">
                    <n-thing>
                        {{ notif.text }}

                        <template #footer>
                        <span style="color: var(--text-secondary)">
                            {{ notif.date }}
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
import {useNotificationStore} from "@data/store/notificationStore";

const notificationStore = useNotificationStore()
notificationStore.loadAllNotifications()

interface Props {
    unread?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    unread: false
})
</script>

<style scoped>
</style>