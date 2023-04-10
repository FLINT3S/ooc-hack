<template>
    <div class="position-relative">
        <div class="home-top-view">
        </div>
        <div class="container content position-relative">
            <section class="search-section">
                <h1 class="search-header">Поиск в реестре объектов недвижимости</h1>

                <SearchPanel class="mt-4"/>
            </section>
            <section class="mt-5">
                <n-card size="medium">
                    <n-list hoverable>
                        <n-list-item v-for="notification in notificationStore.notifications.slice(0, 4)">
                            <div class="d-flex justify-content-between">
                                <span>
                                    {{ notification.text }}
                                </span>
                                <span>
                                    {{ getDateTime(notification.createdAt) }}
                                </span>
                            </div>
                        </n-list-item>
                    </n-list>
                </n-card>

                <router-link class="mt-3 d-flex align-items-center text-accent text-decoration-none" to="/tasks">
                    <span class="me-2">Все решения</span>
                    <ArrowRightIcon/>
                </router-link>
            </section>

            <section class="mt-4 row">
                <div class="col-4">
                    <n-card>
                        <span class="text-secondary">Всео объектов</span>
                        <h1 class="headline-h1">22</h1>
                    </n-card>
                </div>
                <div class="col-4">
                    <n-card>
                        <span class="text-secondary">Решений в ожидании</span>
                        <h1 class="headline-h1">12</h1>
                    </n-card>
                </div>
                <div class="col-4">
                    <n-card>
                        <span class="text-secondary">Решений без срока</span>
                        <h1 class="headline-h1">3</h1>
                    </n-card>
                </div>
            </section>
            <router-link class="mt-3 d-flex align-items-center text-accent text-decoration-none" to="/analytics">
                <span class="me-2">Календарь и аналитика</span>
                <ArrowRightIcon/>
            </router-link>

            <section class="mt-5">
                <Calendar/>
            </section>
        </div>
    </div>
</template>

<script lang="ts" setup>
import SearchPanel from "@components/ui/search/SearchPanel.vue";
import ArrowRightIcon from "@components/ui/icons/ArrowRightIcon.vue";
import {useNotificationStore} from "@data/store/notificationStore";
import Calendar from "@pages/Calendar.vue";
import {getDateTime} from "@data/utils/dateFormatter";

const notificationStore = useNotificationStore()
notificationStore.loadAllNotifications()
</script>

<style scoped>
.home-top-view {
    background: #FFDEDE;
    position: absolute;
    top: 0;
    width: 100%;
    height: 350px;
    z-index: 0;
}

.content {
    z-index: 1;
}

.search-section {
    padding-top: 100px;
}

.search-header {
    font-size: 40px;
    font-weight: 400;
}
</style>