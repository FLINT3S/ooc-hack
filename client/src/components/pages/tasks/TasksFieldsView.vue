<template>
    <div>
        <div class="d-flex justify-content-between align-items-center">
            <h1 class="headline-h1">{{ mode === 'edit' ? 'Данные решения' : 'Добавление решения' }}</h1>
        </div>

        <h2 v-if="mode === 'edit'" class="headline-h2 mt-4">
            {{ taskItem.title }}
        </h2>

        <n-card class="card-secondary mt-4">
            <div class="row">
                <div class="col-5">Статус</div>
                <div class="col-7">
                    <n-popselect v-model:value="taskItem.status" :options="taskStatusOptions">
                        <task-status :status="taskItem.status"/>
                    </n-popselect>
                </div>
            </div>

            <n-divider/>

            <div class="row">
                <div class="col-5 d-flex"><span class="my-auto">Срок</span></div>
                <div class="col-7 d-flex">
                    <div>
                        <n-date-picker v-model:value="dateRange" clearable type="daterange"
                                       @blur="settings.editDate = false"/>
                    </div>
                </div>
            </div>

            <n-divider v-if="mode === 'edit'"/>

            <div v-if="mode === 'edit'" class="row">
                <div class="col-5">Ближайшее совещание</div>
                <div v-if="!taskItem.nearestMeeting" class="col-7">
                    <n-button secondary size="small" @click="onClickPlanMeeting">
                        <template #icon>
                            <svg fill="none" height="20" style="" viewBox="0 0 20 20" width="20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.99 0C4.47 0 0 4.48 0 10C0 15.52 4.47 20 9.99 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 9.99 0ZM10 18C5.58 18 2 14.42 2 10C2 5.58 5.58 2 10 2C14.42 2 18 5.58 18 10C18 14.42 14.42 18 10 18ZM10.5 5H9V11L14.25 14.15L15 12.92L10.5 10.25V5Z"
                                      fill="#262626"/>
                            </svg>
                        </template>

                        Запланировать совещание
                    </n-button>
                </div>
                <div v-else class="col-7">
                    {{ getDateTime(new Date(taskItem.nearestMeeting.date)) }}
                    <br>
                    <a :href="taskItem.nearestMeeting.url" class="underline-hover-link text-accent"
                       target="_blank">{{ taskItem.nearestMeeting.url }}</a>
                </div>
            </div>
        </n-card>

        <section id="common_info" class="mt-5">
            <h3 class="section-title mb-3">Основная информация</h3>

            <n-form>
                <n-form-item label="Формулировка решения">
                    <n-input v-model:value="taskItem.title"/>
                </n-form-item>
                <n-form-item label="Рабочая группа">
                    <n-select v-model:value="workGroups" :options="workGroupsOptions" filterable multiple>
                    </n-select>
                </n-form-item>
                <n-form-item label="Ответственный">
                    <n-select v-model:value="assignee" :options="assigneeOptions" filterable></n-select>
                </n-form-item>
                <n-form-item label="Объект недвижимости">
                    <n-input v-if="mode === 'edit'" :readonly="mode === 'edit'" :value="taskItem?.realEstate?.address"/>
                    <n-select filterable v-else v-model:value="realty" :options="realtyOptions"></n-select>
                </n-form-item>
            </n-form>
        </section>

        <documents-section v-if="mode === 'edit'" :item="taskItem" @upload="onFilesUpload"/>

        <section v-if="mode === 'edit'" id="history" class="mt-4 mb-4">
            <h3 class="section-title mb-3">История изменений</h3>

            <n-list>
                <n-list-item v-for="history in taskItem.taskHistories">
                    <div class="row">
                        <div class="col-9">{{ history['description'] }}</div>
                        <div class="col-3">{{ getDateTime(history['createdAt']) }}</div>
                    </div>
                </n-list-item>
            </n-list>
        </section>

        <n-form>
            <custom-fields-section v-for="section in taskItem.additionalFields" :section="section"/>
        </n-form>

        <div class="d-flex">
            <n-button class="mt-4 mx-auto" secondary size="large" type="primary" @click="emit('add-section')">
                Добавить новый раздел
            </n-button>
        </div>

        <n-modal :show="settings.showMeetingModal" preset="card" style="width: 550px;"
                 title="Планирование видеоконференции" @close="settings.showMeetingModal = false">
            <n-date-picker v-model:value="settings.planMeetingDate" type="datetime"/>
            <n-button block class="mt-3" type="primary" @click="onClickConformMeeting">Запланировать</n-button>
        </n-modal>
    </div>
</template>

<script lang="ts" setup>
import {Task} from "@data/models/Task";
import TaskStatus from "@components/ui/tasks/TaskStatus.vue";
import {useWorkGroupStore} from "@data/store/workGroupStore";
import {useSetLoadingGlobal} from "@data/hooks/useSetLoading";
import {WorkGroup} from "@data/models/WorkGroup";
import {useClientStore} from "@data/store/clientStore";
import {Client} from "@data/models/Client";
import DocumentsSection from "@components/ui/widgets/DocumentsSection.vue";
import {strapiApi} from "@/app/api/api";
import {TaskHistory} from "@data/models/TaskHistory";
import {useRootStore} from "@data/store/rootStore";
import {getDateTime} from "@data/utils/dateFormatter";
import CustomFieldsSection from "@components/ui/realty/CustomFieldsSection.vue";
import {useRealtyStore} from "@data/store/realtyStore";
import {Realty} from "@data/models/Realty";

const props = defineProps<{
    mode: 'edit' | 'add',
    taskItem: Task
}>()

const emit = defineEmits(['add-section'])

const {loading, withLoading} = useSetLoadingGlobal()
const router = useRouter()
const message = useMessage()
const dialog = useDialog()

const taskStatusOptions = [
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
]

const settings = reactive({
    editDate: false,
    showMeetingModal: false,
    planMeetingDate: new Date().getTime()
})
const workGroupStore = useWorkGroupStore()
const clientStore = useClientStore()
const rootStore = useRootStore()
const realtyStore = useRealtyStore()

const workGroupsOptions = computed(() => {
    return workGroupStore.workGroups.map(wg => ({label: wg.title, value: wg.id}))
})

const realty = computed({
    get() {
        return props.taskItem?.realEstate?.id
    },
    set(rid: number) {
        props.taskItem.realEstate = new Realty(rid)
    },
})

const realtyOptions = computed(() => {
    return realtyStore.realtyRegistry.map((r: any) => ({value: r.id, label: r.address}))
})

const dateRange = computed({
    get(): [number, number] {
        return [
            props.taskItem.createdAt?.getTime() || new Date().getTime(),
            props.taskItem.deadline?.getTime() || new Date().getTime()
        ]
    },
    set(dateRange: [number, number]) {
        props.taskItem.createdAt = new Date(dateRange[0])
        props.taskItem.deadline = new Date(dateRange[1])
    },
})

const onClickPlanMeeting = () => {
    settings.showMeetingModal = true
}

const onClickConformMeeting = () => {
    strapiApi.post('/meetings', {
        data: {
            tasks: [props.taskItem.id],
            url: 'https://meet.jit.si/gin-task-' + props.taskItem.id + '-' + settings.planMeetingDate,
            date: new Date(settings.planMeetingDate)
        }
    }).then((r) => {
        dialog.success({
            title: 'ВКС запланирована!',
            content: `Встреча по задаче запланирована на ${getDateTime(new Date(settings.planMeetingDate))}. Ссылка для подключения: ${'https://meet.jit.si/gin-task-' + props.taskItem.id + '-' + settings.planMeetingDate}`,
            positiveText: 'Закрыть',
            onPositiveClick: () => {
                settings.showMeetingModal = false
                props.taskItem.load()
            }
        })
    })
}

const workGroups = computed({
    get(): number[] {
        if (!props.taskItem.workGroups) {
            props.taskItem.workGroups = []
        }

        return props.taskItem.workGroups.map(wg => wg.id) as number[]
    },
    set(wgIds: number[]) {
        props.taskItem.workGroups = wgIds.map(wg => new WorkGroup(wg))
    }
})

const assigneeOptions = computed(() => {
    return clientStore.clients.map(c => ({label: c.fullName, value: c.id}))
})

const assignee = computed({
    get() {
        return props.taskItem.assignee?.id
    },
    set(assigneeId: number) {
        props.taskItem.assignee = new Client(assigneeId)
    },
})

const onFilesUpload = async (attachments: any) => {
    await strapiApi.put(`/tasks/${props.taskItem.id}`, {data: {attachments: [...(props.taskItem?.attachments ? props.taskItem.attachments.map((a: any) => a.id) : []), ...attachments.map((a: any) => a.id)]}})

    const th = new TaskHistory()
    th.task = props.taskItem.id as number
    th.description = `Пользователем ${rootStore.currentUser.fullName} загружены файлы: ` + attachments.map((a: any) => a.name).join(', ')
    th.client = rootStore.currentUser
    await th.create()

    await props.taskItem.load()
}

const initData = () => {
    withLoading(Promise.all([workGroupStore.loadAllWorkGroups(), clientStore.loadAllClients(), realtyStore.loadAllRealty(0)]))
}

initData()
</script>

<style scoped>

</style>