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

        <section class="mt-4">
            <div class="row">
                <div class="col-6">
                    <n-card title="Распределение задач по статусу">
                        <apexchart :options="pieChartOptions" :series="pieSeries" type="donut"></apexchart>
                    </n-card>
                </div>

                <div class="col-6">
                    <n-card title="'Количество мероприятий в апреле">
                        <apexchart :options="columnChartOptions" :series="columnSeries" height="350"
                                   type="bar"></apexchart>
                    </n-card>
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import ReturnToHomeBtn from "@components/ui/widgets/ReturnToHomeBtn.vue";
import Calendar from "@pages/Calendar.vue";
import {useTaskStore} from "@data/store/taskStore";
import {useMeetingStore} from "@data/store/meetingStore";

const taskStore = useTaskStore()
const meetingStore = useMeetingStore()
taskStore.loadAllTasks(1)
meetingStore.loadAllMeetings()

const pieSeries = computed(() => {
    return [
        taskStore.tasksRegistry.filter(t => t.status === 'pending').length,
        taskStore.tasksRegistry.filter(t => t.status === 'in_progress').length,
        taskStore.tasksRegistry.filter(t => t.status === 'review').length,
        taskStore.tasksRegistry.filter(t => t.status === 'need_correction').length,
        taskStore.tasksRegistry.filter(t => t.status === 'done').length,
    ]
})

const pieChartOptions = {
    labels: ['Ожидает', 'В работе', 'На проверке', 'Требуется уточнение', 'Завершено'],
    chart: {
        type: 'donut',
    },
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'bottom'
            }
        }
    }]
}

const columnSeries = computed(() => {
    return [{
        name: 'Количество мероприятий в день',
        data: Array(30).fill(0).map((_, index) => index + 1).map(d => {
            return getTasksByDate(2023, 4, d)?.length || 0 + getMeetingsByDate(2023, 4, d)?.length || 0
        }) as number[]
    }]
})

const columnChartOptions = {
    chart: {
        height: 350,
        type: 'bar',
    },
    plotOptions: {
        bar: {
            borderRadius: 10,
            dataLabels: {
                position: 'top', // top, center, bottom
            },
        }
    },
    xaxis: {
        position: 'top',
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        },
        crosshairs: {
            fill: {
                type: 'gradient',
                gradient: {
                    colorFrom: '#D8E3F0',
                    colorTo: '#BED1E6',
                    stops: [0, 100],
                    opacityFrom: 0.4,
                    opacityTo: 0.5,
                }
            }
        },
        tooltip: {
            enabled: true,
        }
    },
    yaxis: {
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false,
        },
        labels: {
            show: false,
            formatter: function (val: any) {
                return val + "%";
            }
        }

    },
    title: {
        floating: true,
        offsetY: 330,
        align: 'center',
        style: {
            color: '#444'
        }
    }
}

const getTasksByDate = (year: number, month: number, day: number) => {
    return taskStore.tasksRegistry.filter(t => {
        return t.deadline?.toLocaleDateString() === new Date(year, month - 1, day).toLocaleDateString()
    })
}

const getMeetingsByDate = (year: number, month: number, day: number) => {
    return meetingStore.meetings.filter(t => {
        return t.date?.toLocaleDateString() === new Date(year, month - 1, day).toLocaleDateString()
    })
}
</script>