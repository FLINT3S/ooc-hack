<template>
    <section id="documents">
        <h3 class="section-title mb-3">Прикрепленные документы</h3>

        <n-button dashed @click="onClickOpenUploadDialog">
            <template #icon>
                <svg fill="none" height="14" style="" viewBox="0 0 14 14" width="14"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 8H8V13C8 13.55 7.55 14 7 14C6.45 14 6 13.55 6 13V8H1C0.45 8 0 7.55 0 7C0 6.45 0.45 6 1 6H6V1C6 0.45 6.45 0 7 0C7.55 0 8 0.45 8 1V6H13C13.55 6 14 6.45 14 7C14 7.55 13.55 8 13 8Z"
                          fill="#7A7A7A"/>
                </svg>
            </template>

            Прикрепить файл
        </n-button>

        <n-data-table
            :columns="filesColumns"
            :bordered="false" class="mt-3"
            :data="documents"
        >
        </n-data-table>

        <n-modal
                :show="settings.showUploadModal" preset="card" style="width: 500px" title="Загрузка документа"
                @close="onClickUploadEnd"
        >
            <n-upload
                    :custom-request="customRequest"
                    action="/upload"
                    directory-dnd
                    multiple
            >
                <n-upload-dragger>
                    <div style="margin-bottom: 12px">
                        <n-icon :depth="3" size="48">
                            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"
                                 xmlns:xlink="http://www.w3.org/1999/xlink">
                                <path d="M80 152v256a40.12 40.12 0 0 0 40 40h272a40.12 40.12 0 0 0 40-40V152"
                                      fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                      stroke-width="32"></path>
                                <rect fill="none" height="80" rx="28" ry="28" stroke="currentColor"
                                      stroke-linejoin="round" stroke-width="32"
                                      width="416" x="48" y="64"></rect>
                                <path d="M320 304l-64 64l-64-64" fill="none" stroke="currentColor"
                                      stroke-linecap="round"
                                      stroke-linejoin="round" stroke-width="32"></path>
                                <path d="M256 345.89V224" fill="none" stroke="currentColor" stroke-linecap="round"
                                      stroke-linejoin="round" stroke-width="32"></path>
                            </svg>
                        </n-icon>
                    </div>
                    <n-text style="font-size: 16px">
                        Нажмите или перетащите файл в эту область
                    </n-text>
                    <n-p depth="3" style="margin: 8px 0 0 0">
                        Можно выбирать и перетаскивать несколько файлов
                    </n-p>
                </n-upload-dragger>
            </n-upload>

            <n-button block class="mt-3" type="primary" @click="onClickUploadEnd">
                Завершить
            </n-button>
        </n-modal>
    </section>
</template>

<script lang="ts" setup>
import {NP, type UploadCustomRequestOptions, NAvatar} from "naive-ui"
import {strapiApi} from "@/app/api/api";
import {AxiosProgressEvent} from "axios";
import {RouterLink} from "vue-router";
import {Realty} from "@data/models/Realty";
import {Task} from "@data/models/Task";

const message = useMessage()
const emit = defineEmits(['upload'])

const props = defineProps<{
    item: Realty | Task
}>()

const settings = reactive({
    showUploadModal: false,
    uploadedFiles: [] as any[]
})

const documents = computed(() => {
    if (!props.item?.attachments) {
        return []
    }

    return props.item?.attachments
})

const filesColumns = [
    {
        title: 'Название',
        key: 'name',
        ellipsis: true
    },
    {
        title: 'Загружен',
        key: 'createdAt',
        render(row: any) {
            return h(
                NP,
                {},
                {default: () => `${new Date(row.createdAt).toLocaleDateString()} ${new Date(row.createdAt).toLocaleTimeString()}`}
            )
        },
        sorter: (row1: any, row2: any) => (new Date(row1.createdAt).getTime() - new Date(row2.createdAt).getTime())
    },
    {
        title: 'Предпросмотр',
        key: '',
        render(row: any) {
            if (['.png', '.jpg', 'jpeg'].includes(row.ext)) {
                return h(
                    NAvatar,
                    {
                        size: 48,
                        src: strapiApi.defaults.baseURL!.slice(0, -4) + row.url
                    }
                )
            }
        },
    },
    {
        title: 'Скачать',
        key: '',
        render(row: any) {
            return h(
                'a',
                {
                    href: strapiApi.defaults.baseURL!.slice(0, -4) + row.url,
                    className: 'underline-hover-link text-accent'
                },
                {default: () => 'Скачать'}
            )
        },
    }
]

const onClickUploadEnd = () => {
    emit('upload', settings.uploadedFiles)
    settings.showUploadModal = false
}

const onClickOpenUploadDialog = () => {
    settings.showUploadModal = true
    settings.uploadedFiles = []
}

const customRequest = ({
                           file, data, headers, withCredentials,
                           action, onFinish, onError, onProgress
                       }: UploadCustomRequestOptions) => {
    const formData = new FormData()
    if (data) {
        Object.keys(data).forEach((key) => {
            formData.append(
                key,
                data[key as keyof UploadCustomRequestOptions['data']]
            )
        })
    }
    formData.append('files', file.file as File)
    strapiApi
        .post(action as string, formData, {
            onUploadProgress: (e: AxiosProgressEvent) => {
                onProgress({percent: Math.ceil(e.progress as number)})
            }
        })
        .then((r: any) => {
            settings.uploadedFiles.push(r.data[0] as any)
            message.success(`Файл ${r.data[0].name} успешно загружен!`)
            onFinish()
        })
        .catch((error) => {
            message.error(`Ошибка при загрузке: ${error.message}`)
            onError()
        })
}
</script>

<style scoped>

</style>