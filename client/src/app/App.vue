<template>
    <n-config-provider
            :date-locale="dateRuRU"
            :locale="ruRU"
            :theme="appTheme"
    >
        <transition mode="out-in" name="fade">
            <component :is="layout">
                <n-dialog-provider>
                    <n-message-provider>
                        <router-view v-slot="{ Component }">
                            <transition mode="out-in" name="fade">
                                <component :is="Component"/>
                            </transition>
                        </router-view>
                    </n-message-provider>
                </n-dialog-provider>
            </component>
        </transition>
    </n-config-provider>
</template>

<script lang="ts" setup>
import {type Component, computed} from "vue";
import {useRoute} from "vue-router";
import {darkTheme, dateRuRU, lightTheme, ruRU} from "naive-ui";

import EmptyLayout from "@components/layout/EmptyLayout.vue";
import {useRootStore} from "@data/store/rootStore";

const route = useRoute()
const root = useRootStore()
root.initTheme()

const layout = computed(() => {
    return route.meta?.layout as Component ?? EmptyLayout
})

const appTheme = computed(() => {
    return root.theme === 'light' ? lightTheme : darkTheme
})
</script>

<style>
</style>
