<template>
    <div>
        <div class="d-flex justify-content-between align-items-center">
            <h1 class="headline-h1">{{ mode === 'edit' ? 'Данные объекта' : 'Добавление объекта' }}</h1>
            <n-button tertiary type="primary" @click="onClickDeleteRealty" v-if="mode === 'edit'">
                <template #icon>
                    <svg fill="currentColor" height="18" style="" viewBox="0 0 14 18" width="14"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.12 7.47L7 9.59L4.87 7.47L3.46 8.88L5.59 11L3.47 13.12L4.88 14.53L7 12.41L9.12 14.53L10.53 13.12L8.41 11L10.53 8.88L9.12 7.47ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5ZM1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM3 6H11V16H3V6Z"/>
                    </svg>
                </template>

                Удалить объект
            </n-button>
        </div>

        <n-spin :show="loading">
            <n-form class="mt-4">
                <section id="location">
                    <h3 class="section-title mb-3">Местоположение</h3>
                    <n-form-item label="Округ" required>
                        <n-input v-model:value="realtyItem.federalDistrict" type="text"/>
                    </n-form-item>

                    <n-form-item label="Район" required>
                        <n-input v-model:value="realtyItem.region"/>
                    </n-form-item>

                    <n-form-item label="Способ ввода местоположения объекта">
                        <n-select v-model:value="locationType" :options="selectLocationType"/>
                    </n-form-item>

                    <n-form-item v-if="locationType === 'coords'" :show-label="false">
                        <n-grid :cols="2" :x-gap="24">
                            <n-form-item-gi label="Широта" required>
                                <n-input-number
                                        v-model:value="realtyItem.coordinates.lat"
                                        :step="0.01"
                                        placeholder="Формат: 37.61"
                                        @blur="emit('recognize', 'coords')"
                                />
                            </n-form-item-gi>

                            <n-form-item-gi label="Долгота" required>
                                <n-input-number
                                        v-model:value="realtyItem.coordinates.lon"
                                        :step="0.01"
                                        placeholder="Формат: 55.74"
                                        @blur="emit('recognize', 'coords')"
                                />
                            </n-form-item-gi>
                        </n-grid>
                    </n-form-item>

                    <n-form-item v-else label="Адрес" required>
                        <n-input v-model:value="realtyItem.address" @blur="emit('recognize', 'address')"/>
                    </n-form-item>

                    <n-form-item :show-label="false">
                        <div class="d-flex flex-column w-100">
                            <div class="mb-1 d-flex justify-content-between">
                                <span>Объект на карте</span>
                                <n-button :disabled="!realtyItem.coordinates?.lat || !realtyItem.coordinates?.lon" text
                                          type="primary"
                                          @click="updateMapCoords">
                                    Обновить координаты
                                </n-button>
                            </div>

                            <div id="map" style="width: 100%; height: 400px"></div>
                        </div>
                    </n-form-item>
                </section>

                <section id="organization_info">
                    <h3 class="section-title mb-3">Сведения организации</h3>

                    <n-form-item label="Тип объекта" required>
                        <n-select v-model:value="buildingType" :options="buildingTypes"></n-select>
                    </n-form-item>

                    <n-form-item label="Состояние объекта" required>
                        <n-input v-model:value="realtyItem.objectState"/>
                    </n-form-item>

                    <n-form-item label="Площадь объекта" required>
                        <n-input v-model:value="realtyItem.area"/>
                    </n-form-item>
                </section>

                <section id="contacts_info">
                    <h3 class="section-title mb-3">Контактные сведения</h3>

                    <n-form-item label="Собственник" required>
                        <n-input v-model:value="realtyItem.owner"/>
                    </n-form-item>

                    <n-form-item label="Фактический пользователь" required>
                        <n-input v-model:value="realtyItem.actualUser"/>
                    </n-form-item>

                    <n-form-item label="Рабочие группы" required>
                        <n-select v-model:value="workGroups" :options="workGroupOptions" filterable multiple/>
                    </n-form-item>
                </section>

                <custom-fields-section v-for="section in realtyItem.additionalFields" :section="section"/>
            </n-form>

            <div class="d-flex">
                <n-button secondary type="primary" size="large" class="mt-4 mx-auto" @click="emit('add-section')">
                    Добавить новый раздел
                </n-button>
            </div>
        </n-spin>
    </div>
</template>

<script lang="ts" setup>
import {type Ref, ref} from 'vue'
import {strapiApi} from "@/app/api/api";
import {useWorkGroupStore} from "@data/store/workGroupStore";
import {Realty} from "@data/models/Realty"
import {WorkGroup} from "@data/models/WorkGroup";
import {BuildingType} from "@data/models/nested/BuildingType";
import CustomFieldsSection from "@components/ui/realty/CustomFieldsSection.vue";

const router = useRouter()
const message = useMessage()
const dialog = useDialog()
const props = defineProps<{
    realtyItem: Realty,
    loading: boolean,
    mode: 'edit' | 'add'
}>()
const emit = defineEmits(['recognize', 'add-section'])

const selectLocationType = [
    {
        label: 'По координатам',
        value: 'coords'
    },
    {
        label: 'По адресу',
        value: 'address'
    }
]

const mapRef = ref()
const locationType: Ref<string> = ref<string>('address')
const workGroupStore = useWorkGroupStore()
workGroupStore.loadAllWorkGroups()

const workGroupOptions = computed(() => {
    return workGroupStore.workGroups.map(wg => ({label: wg.title, value: wg.id}))
})

const workGroups = computed({
    get(): number[] {
        return props.realtyItem.workGroups.map(wg => wg.id) as number[]
    },
    set(wgIds: number[]) {
        props.realtyItem.workGroups = wgIds.map(wgId => new WorkGroup(wgId))
    }
})

const buildingType = computed({
    get() {
        return props.realtyItem.buildingType?.id
    },
    set(id) {
        props.realtyItem.buildingType = new BuildingType(id)
    },
})

const buildingTypes = ref([])

const updateMapCoords = () => {
    mapRef.value.setCenter([props.realtyItem.coordinates.lon, props.realtyItem.coordinates.lat], 15)
}

strapiApi.get('building-types').then(r => {
    buildingTypes.value = r.data.data.map((t: any) => ({label: t.attributes.title, value: t.id}))
})


onMounted(() => {
    //@ts-ignore
    ymaps.ready(init);

    function init() {
        //@ts-ignore
        mapRef.value = new ymaps.Map("map", {
            center: props.realtyItem?.coordinates?.lon && props.realtyItem?.coordinates?.lat ?
                [props.realtyItem.coordinates.lon, props.realtyItem.coordinates.lat] :
                [55.76, 37.64],
            zoom: 12
        })
    }
})

const onClickDeleteRealty = () => {
    dialog.error({
        title: 'Удалить объект?',
        content: `Объект #${props.realtyItem.id} по адресу ${props.realtyItem.address} будет удалён безвозвратно. Удалить объект?`,
        positiveText: 'Удалить',
        negativeText: 'Отмена',
        onPositiveClick: () => {
            props.realtyItem.delete().then(() => {
                message.success('Объект удалён')
                router.replace('/realty')
            })
        }
    })
}
</script>

<style scoped>

</style>