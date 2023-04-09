<template>
    <section :id="makeSectionId(section.sectionTitle)" class="mb-3">
        <div style="height: 48px">
            <div v-if="!settings.editTitle" class="d-flex align-items-center mb-3">
                <h3 class="section-title">{{ section.sectionTitle }}</h3>
                <n-icon class="ms-2 opacity-75 cursor-pointer" size="18" @click="onClickEditSectionTitle">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                         xmlns:xlink="http://www.w3.org/1999/xlink">
                        <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83a.996.996 0 0 0 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"
                              fill="currentColor"></path>
                    </svg>
                </n-icon>
            </div>
            <n-input
                    v-show="settings.editTitle"
                    ref="titleInputRef"
                    v-model:value="section.sectionTitle"
                    @blur="settings.editTitle = false"
                    @keydown.enter.esc="settings.editTitle = false"
            />
        </div>

        <n-form>
            <n-form-item v-for="(field, fieldIndex) in section.fields" :label="field.title">
                <div class="d-flex align-items-center w-100">
                    <div class="w-100">
                        <n-input v-if="field.type === 'string'" v-model:value="field.value" class="w-100"/>
                        <n-input-number v-else-if="field.type === 'number'" v-model:value="field.value" class="w-100"/>
                    </div>

                    <n-button class="ms-2" text @click="onClickDeleteField(fieldIndex)">
                        <svg fill="currentColor" height="24" style="" viewBox="0 0 24 24" width="24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 12C7 12.55 7.45 13 8 13H16C16.55 13 17 12.55 17 12C17 11.45 16.55 11 16 11H8C7.45 11 7 11.45 7 12ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"/>
                        </svg>
                    </n-button>
                </div>
            </n-form-item>
        </n-form>

        <n-button dashed @click="onClickAddField">
            <template #icon>
                <svg fill="currentColor" height="14" style="" viewBox="0 0 14 14" width="14"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 8H8V13C8 13.55 7.55 14 7 14C6.45 14 6 13.55 6 13V8H1C0.45 8 0 7.55 0 7C0 6.45 0.45 6 1 6H6V1C6 0.45 6.45 0 7 0C7.55 0 8 0.45 8 1V6H13C13.55 6 14 6.45 14 7C14 7.55 13.55 8 13 8Z"/>
                </svg>
            </template>

            Добавить новый атрибут
        </n-button>
    </section>

    <n-modal :show="settings.showAddFieldModal">
        <n-card closable style="width: 600px;" title="Добавление поля" @close="settings.showAddFieldModal = false">
            <n-form>
                <n-form-item label="Название поля" required>
                    <n-input v-model:value="settings.addField.title"/>
                </n-form-item>
                <n-form-item label="Тип поля" required>
                    <n-select :options="fieldTypeOptions" v-model:value="settings.addField.type"/>
                </n-form-item>

                <n-button block type="primary" :disabled="!settings.addField.title" @click="onClickConfirmAddField">
                    Добавить поле
                </n-button>
            </n-form>
        </n-card>
    </n-modal>
</template>

<script lang="ts" setup>
import {AdditionalRealtySection} from "@data/types/additionalRealtyFields";
import {makeSectionId} from "@data/utils/transliterate";

const dialog = useDialog()
const message = useMessage()

const props = defineProps<{
    section: AdditionalRealtySection
}>()

const fieldTypeOptions = [
    {
        label: 'Строка',
        value: 'string'
    },
    {
        label: 'Число',
        value: 'number'
    }
]

const settings = reactive({
    editTitle: false,
    showAddFieldModal: false,
    addField: {
        title: '',
        type: 'string'
    }
})
const titleInputRef = ref()

const onClickEditSectionTitle = () => {
    settings.editTitle = true
    setTimeout(() => {
        titleInputRef.value?.focus()
    })
}

const onClickAddField = () => {
    settings.showAddFieldModal = true
}

const getFieldDefaultValueByType = (type: string) => {
    switch (type) {
        case 'string':
            return ''
        case 'number':
            return 0
        default:
            return null
    }
}

const onClickConfirmAddField = () => {
    props.section.fields.push({
        type: settings.addField.type,
        title: settings.addField.title,
        value: getFieldDefaultValueByType(settings.addField.type)
    })
    message.success('Поле добавлено!')
    settings.showAddFieldModal = false
    settings.addField = {
        title: '',
        type: 'string'
    }
}

const onClickDeleteField = (fieldIndex: number) => {
    dialog.error({
        title: `Удалить поле ${props.section.fields[fieldIndex].title}?`,
        positiveText: 'Удалить',
        negativeText: 'Не удалять',
        onPositiveClick: () => {
            props.section.fields.splice(fieldIndex, 1)
            message.success('Поле удалено!')
        }
    })
}
</script>

<style scoped>

</style>