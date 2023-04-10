<template>
    <div class="container mt-5 realty-add-edit">
        <return-to-home-btn to="back">
            Вернуться к результатам поиска
        </return-to-home-btn>

        <div class="row mt-5">
            <div class="col-8">
                <realty-fields-view
                        v-if="view === 'realty'"
                        :loading="loading"
                        :mode="mode"
                        :realty-item="realtyItem"
                        @recognize="recognizeAddress"
                        @add-section="addSection"
                />
                <realty-tasks-view
                        :realty-item="realtyItem"
                />
            </div>
            <div class="col-1"></div>
            <div class="col-3 position-relative">
                <div class="position-fixed fixed-nav">
                    <n-spin :show="loading">
                        <n-card id="nav_card" class="">
                            <n-button
                                    :quaternary="view === 'tasks'"
                                    :tertiary="view === 'realty'"
                                    block class="justify-content-between"
                                    icon-placement="right"
                                    size="large"
                                    @click="view = 'realty'"
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
                                    :quaternary="view === 'realty'"
                                    :tertiary="view === 'tasks'"
                                    block
                                    class="justify-content-between mt-2"
                                    icon-placement="right"
                                    size="large"
                                    @click="view = 'tasks'"
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

                            <transition name="fade">
                                <div v-if="view === 'realty'">
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
                                            @click="addSection"
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
                                </div>
                            </transition>
                        </n-card>
                    </n-spin>

                    <n-button v-if="view === 'realty'" :disabled="isSaveBtnDisabled" :loading="loading" block class="mt-3" type="primary"
                              @click="onClickSaveRealty">
                        {{ mode === 'edit' ? 'Сохранить изменения' : 'Создать объект' }}
                    </n-button>
                    <n-button v-else  block class="mt-3" type="primary"
                              @click="router.push('/tasks/add')">
                        Добавить решение
                    </n-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {ref} from "vue"
import ReturnToHomeBtn from "@components/ui/widgets/ReturnToHomeBtn.vue";
import {Realty} from "@data/models/Realty";
import {useSetLoading} from "@data/hooks/useSetLoading";
import RealtyFieldsView from "@pages/realty/RealtyFieldsView.vue";
import {serverApi} from "@/app/api/api";
import {makeSectionId} from "@data/utils/transliterate";
import RealtyTasksView from "@pages/realty/RealtyTasksView.vue";

const router = useRouter()
const dialog = useDialog()
const message = useMessage()

const mode = computed(() => {
    return router.currentRoute.value.path.includes('edit') ? 'edit' : 'add' as 'edit' | 'add'
})

const view = ref('realty')
const loading = ref(false)
const realtyItem: Realty = reactive(new Realty()) as Realty

if (mode.value === 'edit') {
    realtyItem.id = parseInt(router.currentRoute.value.params.id as string) as number
    useSetLoading(realtyItem.load(), loading)
}

const goToSection = (id: string) => {
    document!.querySelector('.n-scrollbar-container')!.querySelector(id)!.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
    })
}

const addSection = () => {
    if (!realtyItem.additionalFields) {
        realtyItem.additionalFields = []
    }

    realtyItem.additionalFields.push({
        sectionTitle: 'Новая секция #' + (realtyItem.additionalFields?.length + 1 || 1),
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
            title: 'Местоположение',
            anchor: 'location'
        },
        {
            title: 'Сведения организации',
            anchor: 'organization_info'
        },
        {
            title: 'Контактные сведения',
            anchor: 'contacts_info'
        }
    ]

    return [...standardSections, ...(realtyItem.additionalFields || []).map((section) => ({
        title: section.sectionTitle,
        anchor: makeSectionId(section.sectionTitle)
    }))]
})

const recognizeAddress = (mode: 'address' | 'coords') => {
    console.log('Recognize coords', realtyItem.address, realtyItem.coordinates)

    let locationValue: { longitude: string, latitude: string } | { address: string } = {
        longitude: '',
        latitude: ''
    }

    if (realtyItem.coordinates?.lat && realtyItem.coordinates?.lon && mode === 'coords') {
        locationValue = {
            longitude: realtyItem.coordinates.lon + '',
            latitude: realtyItem.coordinates.lat + ''
        }

        serverApi.post('/geo/position', {type: 'coords', value: locationValue}).then((r: any) => {
            realtyItem.address = r.data.address
            let coords = r.data.coords.pos.split(' ').map(parseFloat) as [number, number]
            realtyItem.coordinates = {lat: coords[0], lon: coords[1]}
            console.log('Recognized:', realtyItem.address, realtyItem.coordinates)
        })
    } else if (realtyItem.address && mode === 'address') {
        locationValue = {
            address: realtyItem.address
        }

        serverApi.post('/geo/position', {type: 'address', value: locationValue}).then((r: any) => {
            realtyItem.address = r.data.address
            let coords = r.data.coords.pos.split(' ').map(parseFloat) as [number, number]
            realtyItem.coordinates = {lat: coords[0], lon: coords[1]}
            console.log('Recognized:', realtyItem.address, realtyItem.coordinates)
        })
    }
}

const onClickSaveRealty = () => {
    if (mode.value === 'edit') {
        realtyItem.update().then(() => {
            dialog.success({
                title: 'Обновлено!',
                content: 'Объект успешно обновлен! Вернуться в реестр или продолжить редактирование?',
                positiveText: 'Вернуться в ресстр',
                negativeText: 'Продолжить редактирование',
                onPositiveClick: () => {
                    router.push('/realty')
                }
            })
        })
    } else {
        realtyItem.create().then(async (r) => {
            message.success("Объект создан")
            realtyItem.id = r.id
            await realtyItem.load()
            await router.replace('/realty/edit/' + r.id)
        })
    }
}

const isSaveBtnDisabled = computed(() => {
    return !realtyItem.validate()
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