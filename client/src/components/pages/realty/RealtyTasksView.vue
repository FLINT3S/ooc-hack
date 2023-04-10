<template>
    <div>
        <div class="d-flex justify-content-between align-items-center">
            <h1 class="headline-h1">Решения по объекту</h1>
        </div>

        <n-data-table
            class="mt-4"
                :columns="realtyTasksColumns"
                :data="realtyItem.tasks"
        />
    </div>
</template>

<script lang="ts" setup>
import {Realty} from "@data/models/Realty";
import {DataTableColumns, NButton, NP} from "naive-ui";
import TaskStatus from "@components/ui/tasks/TaskStatus.vue";

const router = useRouter()

const props = defineProps<{
    realtyItem: Realty
}>()

let realtyTasksColumns: DataTableColumns = [
    {
        title: 'ИД',
        key: 'id',
        width: 100
    },
    {
        title: 'Наименование',
        key: 'title',
        ellipsis: true,
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
        title: 'Срок',
        key: 'deadline',
        render(row: any) {
            return h(
                NP,
                {},
                {default: () => `${row.deadline.toLocaleDateString()} ${row.deadline.toLocaleTimeString()}`}
            )
        },
        sorter: (row1: any, row2: any) => (row1.deadline - row2.deadline)
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
        filterOptions: [
            {
                label: 'Ожидает',
                value: 'pending'
            },
            {
                label: 'В работе',
                value: 'in_progress'
            },
            {
                label: 'На проверке',
                value: 'review'
            },
            {
                label: 'Требуется уточнение',
                value: 'need_correction'
            },
            {
                label: 'Завершено',
                value: 'done'
            }
        ],
        filter(value, row: any) {
            return row.status === value
        }
    }
]
</script>

<style scoped>

</style>