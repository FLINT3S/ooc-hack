<template>
    <n-config-provider
            :date-locale="dateRuRU"
            :locale="ruRU"
            :theme="appTheme"
    >
        <n-dialog-provider>
            <n-message-provider>
                <transition mode="out-in" name="fade">
                    <component :is="layout">
                        <router-view v-slot="{ Component }">
                            <transition :name="transitionName" mode="out-in">
                                <component :is="Component"/>
                            </transition>
                        </router-view>
                    </component>
                </transition>
            </n-message-provider>
        </n-dialog-provider>
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

const transitionName = computed(() => {
    return layout.value === EmptyLayout ? '' : 'fade'
})

const appTheme = computed(() => {
    return root.theme === 'light' ? lightTheme : darkTheme
})
</script>

<style>
</style>
