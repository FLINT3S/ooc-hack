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

import {DataTableColumns, NButton} from "naive-ui";
import {RouterLink} from "vue-router";

import {useRealtyStore} from "@data/store/realtyStore";
import {useSetLoading} from "@data/hooks/useSetLoading";
import ReturnToHomeBtn from "@components/ui/widgets/ReturnToHomeBtn.vue";
import SearchPanel from "@components/ui/search/SearchPanel.vue";
import DownloadRealtyReport from "@components/ui/widgets/DownloadRealtyReport.vue";

const router = useRouter()
const realtyStore = useRealtyStore()
const selectedIds: Ref<number[]> = ref([])
const loading = ref(false)
const pagination = reactive({
    page: 1,
    pageSize: 25
})

onMounted(() => {
    useSetLoading(realtyStore.loadAllRealty(pagination.page), loading)
})

const onSelectRows = (idList: number[]) => {
    selectedIds.value = idList
}

const handlePageChange = (currentPage: number) => {
    if (!loading.value) {
        pagination.page = currentPage
    }
}

const realtyColumns: DataTableColumns = [
    {
        type: 'selection',
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