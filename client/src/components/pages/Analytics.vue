<template>
    <div class="container pt-5">
        <return-to-home-btn to="/">
            Вернуться на главную
        </return-to-home-btn>

        <h1 class="headline-h1 mt-5">
            Дашборд
        </h1>

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

        <Calendar/>
    </div>
</template>

<script lang="ts" setup>
import ReturnToHomeBtn from "@components/ui/widgets/ReturnToHomeBtn.vue";
import Calendar from "@pages/Calendar.vue";
</script>