<template>
    <n-config-provider
            :date-locale="dateRuRU"
            :locale="ruRU"
            :theme="appTheme"
            :theme-overrides="themeOverrides"
    >
        <n-theme-editor>
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
        </n-theme-editor>
    </n-config-provider>
</template>

<script lang="ts" setup>
import {type Component, computed} from "vue";
import {useRoute} from "vue-router";
import {darkTheme, dateRuRU, lightTheme, ruRU, NThemeEditor} from "naive-ui";
import themeOverrides from "@/app/style/naive-ui-theme-overrides.json"

import EmptyLayout from "@components/layout/EmptyLayout.vue";
import {useRootStore} from "@data/store/rootStore";

const route = useRoute()
const router = useRouter()
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

root.restoreLogin()
    .catch(() => {
        router.replace('/login?err=Вы не авторизованы')
    })
</script>

<style>
</style>
