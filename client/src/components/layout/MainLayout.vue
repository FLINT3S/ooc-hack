<template>
    <n-layout>
        <n-layout-header bordered>
            <section class="container py-2 d-flex justify-content-between align-items-center">
                <div class="d-flex">
                    <img alt="" height="35" src="@/assets/images/gin-logo.svg">
                    <div class="text-center my-auto lh-1 ms-2">
                        <h1 class="app-title my-0">
                            ГИН Ассистент
                        </h1>
                    </div>
                </div>

                <menu class="m-0 p-0">
                    <header-navigation-item title="Объекты" to="/registry">
                        <HomeWorkOutlined width="24"/>
                    </header-navigation-item>
                </menu>

                <div class="d-flex align-items-center">
                    <header-notifications-popup/>

                    <header-user-popup/>
                </div>
            </section>
        </n-layout-header>

        <n-scrollbar style="height: calc(100vh - 52px)">
            <n-layout-content style="height: 100%">
                <main class="container pt-3 pb-2" style="height: calc(100vh - 107px)">
                    <n-button @click="onClickThemeChange">
                        theme
                    </n-button>
                </main>
            </n-layout-content>

            <n-layout-footer bordered class="layout-footer">
                <div class="container py-1">
                    <span class="fw-light">
                        FLINT3S Solution for Optimize & Organize Challenge. 2023
                    </span>
                </div>
            </n-layout-footer>
        </n-scrollbar>
    </n-layout>
</template>

<script lang="ts" setup>
import {useRootStore} from "@data/store/rootStore";
import HeaderNavigationItem from "@components/ui/header/HeaderNavigationItem.vue";
import HeaderNotificationsPopup from "@components/ui/header/HeaderNotificationsPopup.vue";
import HeaderUserPopup from "@components/ui/header/HeaderUserPopup.vue";
import {HomeWorkOutlined} from "@vicons/material"

const root = useRootStore()

const onClickThemeChange = () => {
    if (root.theme === 'dark') {
        root.setTheme('light')
    } else {
        root.setTheme('dark')
    }
}
</script>

<style scoped>
.app-title {
    color: var(--accent-red);
    font-size: 16px;
}

.layout-footer {
    background: #E9E9E9;
    color: #BCBCBC
}


</style>