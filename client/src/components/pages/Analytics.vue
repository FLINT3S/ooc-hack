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

        <section class="mt-4 row">
            <div class="col-8">
                <n-calendar
                        #="{ year, month, date }"
                        @update:value="handleUpdateValue"
                >
                    <div>
                        <p v-if="getTasksByDate(year, month, date).length" style="font-size: 12px">Решений:
                            {{ getTasksByDate(year, month, date).length }}</p>
                        <p v-if="getMeetingsByDate(year, month, date).length" style="font-size: 12px">Встреч:
                            {{ getMeetingsByDate(year, month, date).length }}</p>
                    </div>
                </n-calendar>
            </div>
            <div class="col-4">
                <n-card>
                    <h3 class="fw-normal mb-2" v-if="events.tasks">Решения</h3>
                    <router-link v-for="t in events.tasks" :to="'/tasks/edit/' + t.id"
                                 class="underline-hover-link text-accent">
                        {{ t.title }}
                    </router-link>

                    <n-divider/>

                    <h3 class="fw-normal mb-2" v-if="events.meetings">Встречи</h3>
                    <router-link v-for="m in events.meetings" :to="'/tasks/edit/' + m?.tasks?.[0]?.id"
                                 class="underline-hover-link text-accent">
                        {{ getDateTime(m?.date) }} - Встреча по задаче "{{m?.tasks?.[0]?.title}}"
                    </router-link>
                </n-card>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import ReturnToHomeBtn from "@components/ui/widgets/ReturnToHomeBtn.vue";
import {useTaskStore} from "@data/store/taskStore";
import {useMeetingStore} from "@data/store/meetingStore";
import {getDateTime} from "../../data/utils/dateFormatter";

const taskStore = useTaskStore()
const meetingStore = useMeetingStore()
taskStore.loadAllTasks(1)
meetingStore.loadAllMeetings()

const events = reactive({
    tasks: [] as any[],
    meetings: [] as any[]
})

const handleUpdateValue = (time: number, {year, month, date}: { year: number; month: number; date: number }) => {
    events.tasks = getTasksByDate(year, month, date)
    events.meetings = getMeetingsByDate(year, month, date)
}

const getTasksByDate = (year: number, month: number, day: number) => {
    return taskStore.tasksRegistry.filter(t => {
        return t.deadline?.toLocaleDateString() === new Date(year, month, day).toLocaleDateString()
    })
}

const getMeetingsByDate = (year: number, month: number, day: number) => {
    return meetingStore.meetings.filter(t => {
        return t.date?.toLocaleDateString() === new Date(year, month, day).toLocaleDateString()
    })
}

</script>

<style scoped>

</style>