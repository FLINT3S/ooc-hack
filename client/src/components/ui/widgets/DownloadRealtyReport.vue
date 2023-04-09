<template>
    <n-button
            :disabled="!selectedRealtyIds.length"
            secondary
            @click="showDownloadRealtyReportWindow = true"
    >
        <template #icon>
            <n-icon>
                <svg fill="none" height="22" style="" viewBox="0 0 20 22" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3.50299C5 2.70734 5.31607 1.94428 5.87868 1.38167C6.44129 0.819061 7.20435 0.502991 8 0.502991H13.373C13.9695 0.503516 14.5414 0.740913 14.963 1.16299L19.34 5.53699C19.7621 5.95854 19.9995 6.53046 20 7.12699V18.497C20 19.2926 19.6839 20.0557 19.1213 20.6183C18.5587 21.1809 17.7956 21.497 17 21.497H11.999C12.6035 21.071 13.1465 20.567 13.616 19.997H17C17.3978 19.997 17.7794 19.839 18.0607 19.5577C18.342 19.2763 18.5 18.8948 18.5 18.497V8.00449H14.75C14.1533 8.00449 13.581 7.76744 13.159 7.34548C12.7371 6.92352 12.5 6.35123 12.5 5.75449V2.00299H8C7.60218 2.00299 7.22064 2.16103 6.93934 2.44233C6.65804 2.72364 6.5 3.10517 6.5 3.50299V6.53299C5.99248 6.5788 5.49032 6.6717 5 6.81049V3.50299ZM14 2.31799V5.75299C14 5.9519 14.079 6.14267 14.2197 6.28332C14.3603 6.42397 14.5511 6.50299 14.75 6.50299H18.1865L14 2.31949V2.31799ZM14 14.75C14 16.5402 13.2888 18.2571 12.023 19.523C10.7571 20.7888 9.04021 21.5 7.25 21.5C5.45979 21.5 3.7429 20.7888 2.47703 19.523C1.21116 18.2571 0.5 16.5402 0.5 14.75C0.5 12.9598 1.21116 11.2429 2.47703 9.97702C3.7429 8.71115 5.45979 7.99999 7.25 7.99999C9.04021 7.99999 10.7571 8.71115 12.023 9.97702C13.2888 11.2429 14 12.9598 14 14.75ZM6.719 18.2795L6.7235 18.284C6.8627 18.4213 7.05 18.4988 7.2455 18.5H7.2545C7.45147 18.4988 7.64005 18.4201 7.7795 18.281L10.7795 15.281C10.8492 15.2114 10.9046 15.1287 10.9423 15.0377C10.9801 14.9466 10.9996 14.8491 10.9997 14.7505C10.9997 14.652 10.9804 14.5544 10.9427 14.4633C10.9051 14.3722 10.8499 14.2895 10.7802 14.2197C10.7106 14.15 10.6279 14.0947 10.5369 14.0569C10.4459 14.0191 10.3483 13.9996 10.2498 13.9996C10.1512 13.9995 10.0536 14.0188 9.96257 14.0565C9.8715 14.0941 9.78873 14.1494 9.719 14.219L8 15.9395V11.75C8 11.5511 7.92098 11.3603 7.78033 11.2197C7.63968 11.079 7.44891 11 7.25 11C7.05109 11 6.86032 11.079 6.71967 11.2197C6.57902 11.3603 6.5 11.5511 6.5 11.75V15.9395L4.781 14.219C4.64017 14.0782 4.44916 13.999 4.25 13.999C4.05084 13.999 3.85983 14.0782 3.719 14.219C3.57817 14.3598 3.49905 14.5508 3.49905 14.75C3.49905 14.9492 3.57817 15.1402 3.719 15.281L6.719 18.281V18.2795Z"
                          fill="#262626"/>
                </svg>
            </n-icon>
        </template>

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
import {serverApi} from "@/app/api/api";
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