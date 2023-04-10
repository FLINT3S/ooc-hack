<template>
    <div class="container mt-5 realty-add-edit">
        <return-to-home-btn to="back">
            Вернуться к результатам поиска
        </return-to-home-btn>

        <div class="row mt-5">
            <div class="col-8">
                <n-spin :show="loading">
                    <tasks-fields-view
                            :mode="mode"
                            :task-item="taskItem"
                            @add-section="onClickAddSection"
                    />
                </n-spin>
            </div>
            <div class="col-1"></div>
            <div class="col-3 position-relative">
                <div class="position-fixed fixed-nav">
                    <n-spin :show="loading">
                        <n-card id="nav_card" class="">
                            <n-button
                                    block
                                    class="justify-content-between"
                                    icon-placement="right"
                                    quaternary
                                    size="large"
                                    @click=""
                            >
                                Данные объекта

                                <template #icon>
                                    <n-icon size="13">
                                        <svg fill="none" height="8" style="" viewBox="0 0 7 11" width="3"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0.800781 9.13375L4.42661 5.5L0.800781 1.86625L1.91703 0.75L6.66703 5.5L1.91703 10.25L0.800781 9.13375Z"
                                                  fill="#262626"/>
                                        </svg>
                                    </n-icon>
                                </template>
                            </n-button>

                            <n-button
                                    block
                                    class="justify-content-between mt-2"
                                    icon-placement="right"
                                    size="large"
                                    tertiary
                            >
                                Решения по объекту

                                <template #icon>
                                    <n-icon size="13">
                                        <svg fill="none" height="8" style="" viewBox="0 0 7 11" width="3"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0.800781 9.13375L4.42661 5.5L0.800781 1.86625L1.91703 0.75L6.66703 5.5L1.91703 10.25L0.800781 9.13375Z"
                                                  fill="#262626"/>
                                        </svg>
                                    </n-icon>
                                </template>
                            </n-button>

                            <n-divider/>

                            <n-space size="medium" vertical>
                                <n-button v-for="section in allSections" block
                                          class="justify-content-start mb-2"
                                          text
                                          @click="goToSection('#' + section.anchor)">
                                    {{ section.title }}
                                </n-button>
                            </n-space>

                            <n-button
                                    block
                                    class="justify-content-start opacity-75 mt-4"
                                    size="medium" text
                                    @click="onClickAddSection"
                            >
                                <template #icon>
                                    <svg fill="none" height="14" style="" viewBox="0 0 14 14" width="14"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 8H8V13C8 13.55 7.55 14 7 14C6.45 14 6 13.55 6 13V8H1C0.45 8 0 7.55 0 7C0 6.45 0.45 6 1 6H6V1C6 0.45 6.45 0 7 0C7.55 0 8 0.45 8 1V6H13C13.55 6 14 6.45 14 7C14 7.55 13.55 8 13 8Z"
                                              fill="#7A7A7A"/>
                                    </svg>
                                </template>

                                Добавить раздел
                            </n-button>
                        </n-card>
                    </n-spin>

                    <n-button :disabled="isSaveBtnDisabled" :loading="loading" block class="mt-3" type="primary"
                              @click="onClickSaveTask">
                        {{ mode === 'edit' ? 'Сохранить изменения' : 'Создать решение' }}
                    </n-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {ref} from "vue"
import {useSetLoading} from "@data/hooks/useSetLoading";
import {makeSectionId} from "@data/utils/transliterate";

import {Task} from "@data/models/Task";

import ReturnToHomeBtn from "@components/ui/widgets/ReturnToHomeBtn.vue";
import TasksFieldsView from "@pages/tasks/TasksFieldsView.vue";
import {TaskHistory} from "@data/models/TaskHistory";
import {useRootStore} from "@data/store/rootStore";

const router = useRouter()
const dialog = useDialog()
const message = useMessage()

const mode = computed(() => {
    return router.currentRoute.value.path.includes('edit') ? 'edit' : 'add' as 'edit' | 'add'
})

const loading = ref(false)
const taskItem: Task = reactive(new Task()) as Task
const rootStore = useRootStore()

if (mode.value === 'edit') {
    taskItem.id = parseInt(router.currentRoute.value.params.id as string) as number
    useSetLoading(taskItem.load(), loading)
}

const goToSection = (id: string) => {
    document!.querySelector('.n-scrollbar-container')!.querySelector(id)!.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
    })
}

const onClickAddSection = () => {
    if (!taskItem.additionalFields) {
        taskItem.additionalFields = []
    }

    taskItem.additionalFields.push({
        sectionTitle: 'Новая секция #' + (taskItem.additionalFields?.length + 1 || 1),
        fields: [
            {
                type: 'string',
                value: '',
                title: 'Новое поле'
            }
        ]
    })
}

const allSections = computed(() => {
    const standardSections = [
        {
            title: 'Основная информация',
            anchor: 'common_info'
        },
        {
            title: 'Прикрепленные документы',
            anchor: 'documents'
        },
        {
            title: 'История изменений',
            anchor: 'history'
        }
    ]

    return [...standardSections, ...(taskItem.additionalFields || []).map((section: any) => ({
        title: section.sectionTitle,
        anchor: makeSectionId(section.sectionTitle)
    }))]
})

const onClickSaveTask = async () => {
    if (mode.value === 'edit') {
        taskItem.update().then(() => {
            dialog.success({
                title: 'Обновлено!',
                content: 'Объект успешно обновлен! Вернуться в реестр или продолжить редактирование?',
                positiveText: 'Вернуться в ресстр',
                negativeText: 'Продолжить редактирование',
                onPositiveClick: () => {
                    router.push('/tasks')
                }
            })

            const th = new TaskHistory()
            th.task = taskItem.id as number
            th.description = `Пользователь ${rootStore.currentUser.fullName} внёс изменения в решение`
            th.client = rootStore.currentUser
            await th.create()
        })
    } else {
        taskItem.create().then(async (r) => {
            taskItem.id = r.id
            await taskItem.load()
            await router.replace('/tasks/edit/' + r.id)
            message.success("Объект создан")
        })
    }
}

const isSaveBtnDisabled = computed(() => {
    return !taskItem.validate()
})
</script>

<style scoped>
.fixed-nav {
    width: 350px;
}

.realty-add-edit {
    padding-bottom: 200px;
}
</style>