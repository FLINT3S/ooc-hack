<template>
    <div class="container mt-5">
        <return-to-home-btn/>

        <search-panel class="mt-5" search-type="tasks"/>

        <section class="mt-5">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-3">
                    <h1 class="headline-h1">
                        Найдено в реестре
                    </h1>

                    <n-button secondary @click="router.push('/tasks/add')">
                        Добавить решение

                        <template #icon>
                            <n-icon size="15">
                                <svg fill="none" height="12" style="" viewBox="0 0 14 14" width="12"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 8H8V13C8 13.55 7.55 14 7 14C6.45 14 6 13.55 6 13V8H1C0.45 8 0 7.55 0 7C0 6.45 0.45 6 1 6H6V1C6 0.45 6.45 0 7 0C7.55 0 8 0.45 8 1V6H13C13.55 6 14 6.45 14 7C14 7.55 13.55 8 13 8Z"
                                          fill="#262626"/>
                                </svg>
                            </n-icon>
                        </template>
                    </n-button>
                </div>

                <router-link class="text-accent underline-hover-link" to="/realty">
                    Перейти в реестр объектов
                </router-link>
            </div>

            <n-skeleton v-if="loading" height="30px" width="150px"/>
            <h3 v-else class="found-rows">
                Записей: {{ taskStore.tasksMeta?.pagination?.total }}
            </h3>
        </section>

        <n-data-table
                :bordered="false"
                :columns="taskColumns"
                :data="taskStore.tasksRegistry"
                :loading="loading"
                :pagination="pagination"
                :row-key="(row: any) => row.id"
                class="mt-4"
                selection
                @update:page="handlePageChange"
        >
        </n-data-table>
    </div>
</template>

<script lang="ts" setup>
import {type Ref, ref} from "vue"

import {DataTableColumns, NButton, NP} from "naive-ui";
import {RouterLink} from "vue-router";

import {useTaskStore} from "@data/store/taskStore";
import {useSetLoading} from "@data/hooks/useSetLoading";
import ReturnToHomeBtn from "@components/ui/widgets/ReturnToHomeBtn.vue";
import SearchPanel from "@components/ui/search/SearchPanel.vue";
import {Task} from "@data/models/Task";
import TaskStatus from "@components/ui/tasks/TaskStatus.vue";

const router = useRouter()
const taskStore = useTaskStore()
const selectedIds: Ref<number[]> = ref([])
const loading = ref(false)
const pagination = reactive({
    page: 1,
    pageSize: 10
})


const loadData = () => {
    if (!router.currentRoute.value?.query?.searchQuery) {
        useSetLoading(taskStore.loadAllTasks(pagination.page), loading)
    } else {
        useSetLoading(taskStore.searchByQuery(router.currentRoute.value?.query?.searchQuery as string), loading)
    }
}

watchEffect(() => {
    loadData()
})

const handlePageChange = (currentPage: number) => {
    if (!loading.value) {
        pagination.page = currentPage
    }
}

const getRealtyNearestDate = (row: any) => {
    return [...row?.tasks?.map((t: Task) => t?.deadline), row?.createdAt]?.sort((a, b) => a - b)[0] || null
}

const taskColumns = computed(() => {
    if (!router.currentRoute.value?.query?.searchQuery && !loading.value) {
        return rawRealtyColumns
    }
    return rawRealtyColumns.filter((c: any) => c?.key !== 'date')
})

let rawRealtyColumns: DataTableColumns = [
    {
        title: 'ИД',
        key: 'id'
    },
    {
        title: 'Наименование',
        key: 'title',
        render(row: any) {
            return h(
                NButton,
                {
                    type: 'primary',
                    text: true,
                    onClick: () => {
                        router.push('/tasks/edit/' + row.id)
                    }
                },
                {default: () => row.title}
            )
        }
    },
    {
        title: 'Ответственный',
        key: 'assignee.name',
    },
    {
        title: 'Срок',
        key: 'deadline',
        render(row: any) {
            return h(
                NP,
                {},
                {default: () => `${row.deadline.toLocaleDateString()} ${row.deadline.toLocaleTimeString()}`}
            )
        }
    },
    {
        title: 'Статус',
        key: 'status',
        render(row: any) {
            return h(
                TaskStatus,
                {
                    status: row.status
                },
                {default: () => row.status}
            )
        },
    },
    {
        title: 'Собственник',
        key: 'realEstate.owner'
    }
]
</script>

<style scoped>

</style>