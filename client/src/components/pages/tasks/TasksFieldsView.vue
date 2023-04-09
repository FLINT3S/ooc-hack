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
                    <task-status :status="taskItem.status"/>
                </div>
            </div>

            <n-divider/>

            <div class="row">
                <div class="col-5">Срок</div>
                <div class="col-7">
                    {{ taskItem.createdAt?.toLocaleDateString() }} - {{ taskItem.deadline?.toLocaleDateString() }}
                </div>
            </div>

            <n-divider/>

            <div class="row">
                <div class="col-5">Ближайшее совещание</div>
                <div class="col-7">
                    <n-button secondary size="small">
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
                    <n-input :value="taskItem?.realEstate?.address"/>
                </n-form-item>
            </n-form>
        </section>

        <documents-section @upload="onFilesUpload"/>

        <section id="history">

        </section>
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

const props = defineProps<{
    mode: 'edit' | 'add',
    taskItem: Task
}>()

const {loading, withLoading} = useSetLoadingGlobal()
const router = useRouter()
const message = useMessage()
const dialog = useDialog()

const workGroupStore = useWorkGroupStore()
const clientStore = useClientStore()

const workGroupsOptions = computed(() => {
    return workGroupStore.workGroups.map(wg => ({label: wg.title, value: wg.id}))
})

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

const onFilesUpload = (attachments: any) => {
    console.log(attachments)
    strapiApi.put(`/tasks/${props.taskItem.id}`, {data: {attachments: [...(props.taskItem?.attachments ? props.taskItem.attachments.map((a: any) => a.id) : []), ...attachments.map(a => a.id)]}})
    props.taskItem.load()
}

const initData = () => {
    withLoading(Promise.all([workGroupStore.loadAllWorkGroups(), clientStore.loadAllClients()]))
}

initData()
</script>

<style scoped>

</style>