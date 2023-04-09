<template>
    <div class="container mt-5">
        <return-to-home-btn/>

        <search-panel class="mt-5"/>

        <section class="mt-5">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-3">
                    <h1 class="headline-h1">
                        Найдено в реестре
                    </h1>

                    <download-realty-report
                            :selected-realty-ids="selectedIds"
                    />

                    <n-button secondary @click="router.push('/realty/add')">
                        Добавить объект

                        <template #icon>
                            <n-icon>
                                <svg fill="none" height="22" style="" viewBox="0 0 19 22" width="19"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 0V3H19V5H16V8H14V5H11V3H14V0H16ZM8 12C6.9 12 6 11.1 6 10C6 8.9 6.9 8 8 8C9.1 8 10 8.9 10 10C10 11.1 9.1 12 8 12ZM9 2.06V4.08C8.66921 4.02773 8.33489 4.00098 8 4C4.65 4 2 6.57 2 10.2C2 12.54 3.95 15.64 8 19.34C12.05 15.64 14 12.55 14 10.2V10H16V10.2C16 13.52 13.33 17.45 8 22C2.67 17.45 0 13.52 0 10.2C0 5.22 3.8 2 8 2C8.34 2 8.67 2.02 9 2.06Z"
                                          fill="#262626"/>
                                </svg>
                            </n-icon>
                        </template>
                    </n-button>
                </div>

                <router-link class="text-accent underline-hover-link" to="/tasks">
                    Перейти в реестр решений
                </router-link>
            </div>

            <n-skeleton v-if="loading" height="30px" width="150px"/>
            <h3 v-else class="found-rows">
                Записей: {{ realtyStore.realtyMeta?.pagination?.total }}
            </h3>
        </section>

        <n-data-table
                :bordered="false"
                :columns="realtyColumns"
                :data="realtyStore.realtyRegistry"
                :loading="loading"
                :pagination="pagination"
                :row-key="(row: any) => row.id"
                class="mt-4"
                selection
                @update:page="handlePageChange"
                @update:checked-row-keys="onSelectRows"
        >

        </n-data-table>
    </div>
</template>

<script lang="ts" setup>
import {type Ref, ref} from "vue"

import {DataTableColumns, NButton, NP} from "naive-ui";
import {RouterLink} from "vue-router";

import {useRealtyStore} from "@data/store/realtyStore";
import {useSetLoading} from "@data/hooks/useSetLoading";
import ReturnToHomeBtn from "@components/ui/widgets/ReturnToHomeBtn.vue";
import SearchPanel from "@components/ui/search/SearchPanel.vue";
import DownloadRealtyReport from "@components/ui/widgets/DownloadRealtyReport.vue";
import {Task} from "@data/models/Task";

const router = useRouter()
const realtyStore = useRealtyStore()
const selectedIds: Ref<number[]> = ref([])
const loading = ref(false)
const pagination = reactive({
    page: 1,
    pageSize: 25
})


const loadData = () => {
    if (!router.currentRoute.value?.query?.searchQuery) {
        useSetLoading(realtyStore.loadAllRealty(pagination.page), loading)
    } else {
        useSetLoading(realtyStore.searchByQuery(router.currentRoute.value?.query?.searchQuery as string), loading)
    }
}

watchEffect(() => {
    loadData()
})

const onSelectRows = (idList: number[]) => {
    selectedIds.value = idList
}

const handlePageChange = (currentPage: number) => {
    if (!loading.value) {
        pagination.page = currentPage
    }
}

const getRealtyNearestDate = (row: any) => {
    return [...row?.tasks?.map((t: Task) => t?.deadline), row?.createdAt]?.sort((a, b) => a - b)[0] || null
}

const realtyColumns = computed(() => {
    if (!router.currentRoute.value?.query?.searchQuery && !loading.value) {
        return rawRealtyColumns
    }
    return rawRealtyColumns.filter((c: any) => c?.key !== 'date')
})

let rawRealtyColumns: DataTableColumns = [
    {
        type: 'selection',
    },
    {
        title: 'ИД',
        key: 'id'
    },
    {
        title: 'Адрес',
        key: 'address',
        render(row: any) {
            return h(
                RouterLink,
                {
                    to: '/realty/edit/' + row.id,
                    class: 'underline-hover-link text-accent'
                },
                {default: () => row.address}
            )
        }
    },
    {
        title: 'Тип объекта',
        key: 'buildingType.title'
    },
    {
        title: 'Собственник',
        key: 'owner'
    },
    {
        title: 'Ближайшая дата',
        key: 'date',
        render(row: any) {
            return h(
                NP,
                {},
                {default: () => getRealtyNearestDate(row)?.toLocaleDateString()}
            )
        },
        sortOrder: 'ascend',
        sorter: (row1: any, row2: any) => getRealtyNearestDate(row1) - getRealtyNearestDate(row2)
    },
    {
        title: 'Состояние',
        key: 'objectState'
    },
    {
        title: 'Решения',
        key: '',
        render(row: any) {
            return h(
                NButton,
                {
                    quaternary: true,
                    type: 'primary',
                    size: 'small',
                    onClick: () => router.push('/tasks/byRealty/' + row.id)
                },
                {default: () => 'Открыть'}
            )
        }
    }
]
</script>

<style scoped>

</style>