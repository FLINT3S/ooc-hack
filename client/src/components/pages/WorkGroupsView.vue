<template>
    <div class="container pt-5">
        <div class="d-flex align-items-center">
            <h1 class="headline-h1">Рабочие группы</h1>
            <n-button class="ms-3" tertiary @click="showAddWorkGroupModal = true">
                <template #icon>
                    <svg fill="none" height="14" style="" viewBox="0 0 14 14" width="14"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 8H8V13C8 13.55 7.55 14 7 14C6.45 14 6 13.55 6 13V8H1C0.45 8 0 7.55 0 7C0 6.45 0.45 6 1 6H6V1C6 0.45 6.45 0 7 0C7.55 0 8 0.45 8 1V6H13C13.55 6 14 6.45 14 7C14 7.55 13.55 8 13 8Z"
                              fill="#262626"/>
                    </svg>
                </template>

                Добавить рабочую группу
            </n-button>
        </div>

        <div class="mt-4">
            <div class="mb-2">
                Выберите рабочую группу для редактирования
            </div>

            <n-select v-model:value="selectedWorkGroup" :options="workGroupOptions" filterable>
            </n-select>
        </div>

        <div class="mb-2 mt-4 text-secondary">
            Отметьте членов, которых нужно включить в рабочую группу
        </div>
        <n-transfer
                v-model:value="transferWorkGroupValue"
                :disabled="!editWorkGroup.id"
                :options="clientOptions"
                show-selected
                source-filterable
        />

        <n-button :disabled="!editWorkGroup.id" class="mt-4" type="primary" @click="onCLickSaveWorkGroup">
            Сохранить рабочую группу
        </n-button>

        <n-button :disabled="!editWorkGroup.id" class="mt-4 ms-3" tertiary type="primary" @click="onClickDeleteWorkGroup">
            Удалить рабочую группу
        </n-button>

        <n-modal :show="showAddWorkGroupModal" preset="card" style="width: 500px" title="Добавление рабочей группы"
                 @close="showAddWorkGroupModal = false">
            <n-form-item label="Название рабочей группы">
                <n-input v-model:value="addWorkGroupTitle">
                </n-input>
            </n-form-item>

            <n-button type="primary" block @click="onClickAddWorkGroup">
                Сохранить
            </n-button>
        </n-modal>
    </div>
</template>

<script lang="ts" setup>
import {ref} from "vue"
import {useWorkGroupStore} from "@data/store/workGroupStore";
import {useClientStore} from "@data/store/clientStore";
import {WorkGroup} from "@data/models/WorkGroup";
import {Client} from "@data/models/Client";

const message = useMessage()
const dialog = useDialog()

const workGroupStore = useWorkGroupStore()
const clientStore = useClientStore()

workGroupStore.loadAllWorkGroups()
clientStore.loadAllClients()

const editWorkGroup = ref(new WorkGroup())
const showAddWorkGroupModal = ref(false)
const addWorkGroupTitle = ref("Рабочая группа")

const selectedWorkGroup = computed({
    get() {
        return editWorkGroup.value.id as number
    },
    set(wgId: number) {
        editWorkGroup.value = workGroupStore.workGroups.find(wg => wg.id === wgId)!
        editWorkGroup.value.load()
    },
})

const transferWorkGroupValue = computed({
    get() {
        return editWorkGroup.value.clients.map(c => c.id) as number[]
    },
    set(cIds: number[]) {
        editWorkGroup.value.clients = cIds.map(cid => new Client(cid))
    },
})

const workGroupOptions = computed(() => {
    return workGroupStore.workGroups.map(wg => ({label: wg.title, value: wg.id}))
})

const clientOptions = computed(() => {
    return clientStore.clients.map(c => ({label: c.fullName, value: c.id}))
})

const onCLickSaveWorkGroup = () => {
    editWorkGroup.value.update()
    message.success("Рабочая группа сохранена")
}

const onClickAddWorkGroup = async () => {
    const saveWorkGroup = new WorkGroup()
    saveWorkGroup.title = addWorkGroupTitle.value
    const r = await saveWorkGroup.create()
    showAddWorkGroupModal.value = false
    message.success(`Рабочая группа "${addWorkGroupTitle.value}" создана`)
    editWorkGroup.value.id = r.id
    await workGroupStore.loadAllWorkGroups()
    await editWorkGroup.value.load()
}

const onClickDeleteWorkGroup = async () => {
    dialog.error({
        title: `Удалить рабочую группу?`,
        positiveText: 'Удалить',
        negativeText: 'Отмена',
        onPositiveClick: async () => {
            await editWorkGroup.value.delete()
            editWorkGroup.value.id = null as unknown as number
            await workGroupStore.loadAllWorkGroups()
        }
    })
}
</script>


<style scoped>

</style>