<template>
    <n-button
            secondary
            :disabled="!selectedRealtyIds.length"
            @click="showDownloadRealtyReportWindow = true"
    >
        Скачать отчёт
    </n-button>

    <n-modal
            v-model:show="showDownloadRealtyReportWindow"
            style="width: 600px"
    >
        <n-card
                closable
                title="Скачать отчет"
                @close="showDownloadRealtyReportWindow = false"
        >
            <p class="mb-3">Выберите поля, которые необходимо включить в отчет:</p>

            <n-space vertical>
                <n-checkbox
                        v-model:checked="reportSettings.realtyAddress"
                        label="Адрес"
                />
                <n-checkbox
                        v-model:checked="reportSettings.realtyType"
                        label="Тип недвижимости"
                />
                <n-checkbox
                        v-model:checked="reportSettings.realtyOwner"
                        label="Владелец"
                />
                <n-checkbox
                        v-model:checked="reportSettings.taskTitle"
                        label="Название задачи"
                />
                <n-checkbox
                        v-model:checked="reportSettings.taskDeadline"
                        label="Срок окончания"
                />
                <n-checkbox
                        v-model:checked="reportSettings.taskStatus"
                        label="Статус задачи"
                />
                <n-checkbox
                        v-model:checked="reportSettings.taskAssignee"
                        label="Исполнитель"
                />
            </n-space>

            <n-button
                    :loading="loading"
                    block
                    class="mt-3"
                    type="primary"
                    @click="onClickGenerateReport"
            >
                Сгенерировать отчет
            </n-button>
        </n-card>
    </n-modal>
</template>

<script lang="ts" setup>
import {ref} from "vue"
import {NButton} from "naive-ui";
import {serverApi, strapiApi} from "@/app/api/api";
import {useSetLoading} from "@data/hooks/useSetLoading";

interface Props {
    selectedRealtyIds: number[]
}

const props = defineProps<Props>()

const loading = ref(false)
const showDownloadRealtyReportWindow = ref(false)
const reportSettings = reactive({
    realtyAddress: true,
    realtyType: false,
    realtyOwner: true,
    taskTitle: true,
    taskDeadline: true,
    taskStatus: false,
    taskAssignee: true,
})

const onClickGenerateReport = () => {
    useSetLoading(serverApi.post('/xlsx/generate', {
        realtyIds: props.selectedRealtyIds,
        reportSettings: reportSettings
    }), loading).then((r: any) => {
        const downloadLink = document.createElement('a')
        downloadLink.download = `report-${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}.xlsx`
        downloadLink.href = "https://strapi.ooc.flint3s.ru" + r.data[0].url
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
    })
}
</script>

<style scoped>

</style>