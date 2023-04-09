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
                    <n-list clickable hoverable>
                        <n-list-item v-for="i in 3">
                            <div class="d-flex justify-content-between">
                                <span>
                                    Изменён статус объекта “г. Москва, ул. Беловежская, вл.4” на Завершено
                                </span>
                                <span>
                                    05.04.23 08:10
                                </span>
                            </div>
                        </n-list-item>
                    </n-list>
                </n-card>

                <router-link class="mt-3 d-flex align-items-center text-accent text-decoration-none" to="/decisions">
                    <span class="me-2">Все уведомления</span>
                    <ArrowRightIcon/>
                </router-link>
            </section>

            <section class="mt-5">
                <n-card size="medium">
                    <div class="row">
                        <div class="col-4">
                            <DashboardNumber number="4" title="Нарушений на объектах"/>
                        </div>
                        <div class="col-4">
                            <DashboardNumber number="6" title="Требуют внимания"/>
                        </div>
                        <div class="col-4">
                            <DashboardNumber number="12" title="Просроченных задач"/>
                        </div>
                    </div>
                </n-card>
            </section>

            <section class="mt-5">
                <UpcomingEvents/>
            </section>
        </div>
    </div>
</template>

<script lang="ts" setup>
import SearchPanel from "@components/ui/search/SearchPanel.vue";
import DashboardNumber from "@components/ui/widgets/DashboardNumber.vue";
import ArrowRightIcon from "@components/ui/icons/ArrowRightIcon.vue";
import UpcomingEvents from "@components/ui/widgets/UpcomingEvents.vue";
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