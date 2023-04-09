<template>
    <div>
        <div class="d-flex justify-content-between align-items-center">
            <h1 class="headline-h1">Данные объекта</h1>
            <n-button tertiary type="primary">
                <template #icon>
                    <svg fill="none" height="18" style="" viewBox="0 0 14 18" width="14"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.12 7.47L7 9.59L4.87 7.47L3.46 8.88L5.59 11L3.47 13.12L4.88 14.53L7 12.41L9.12 14.53L10.53 13.12L8.41 11L10.53 8.88L9.12 7.47ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5ZM1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM3 6H11V16H3V6Z"
                              fill="#B91827"/>
                    </svg>
                </template>

                Удалить объект
            </n-button>
        </div>

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
                        <n-form-item-gi label="Долгота" required>
                            <n-input-number
                                    placeholder="Формат: 55.74"
                                    v-model:value="realtyItem.coordinates.lon"
                                    @blur="emit('recognize')"
                            />
                        </n-form-item-gi>
                        <n-form-item-gi label="Широта" required>
                            <n-input-number
                                    placeholder="Формат: 37.61"
                                    v-model:value="realtyItem.coordinates.lat"
                                    @blur="emit('recognize')"
                            />
                        </n-form-item-gi>
                    </n-grid>
                </n-form-item>

                <n-form-item v-else label="Адрес" required>
                    <n-input v-model:value="realtyItem.address" @blur="emit('recognize')"/>
                </n-form-item>

                <n-form-item :show-label="false">
                    <div class="d-flex flex-column w-100">
                        <div class="mb-1 d-flex justify-content-between">
                            <span>Объект на карте</span>
                            <n-button text type="primary" @click="locationType = 'coords'">
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
                    <n-select :options="buildingTypes"></n-select>
                </n-form-item>

                <n-form-item label="Состояние объекта" required>
                    <n-input/>
                </n-form-item>

                <n-form-item label="Площадь объекта" required>
                    <n-input/>
                </n-form-item>
            </section>

            <section id="contacts_info">
                <h3 class="section-title mb-3">Контактные сведения</h3>

                <n-form-item label="Собственник" required>
                    <n-input/>
                </n-form-item>

                <n-form-item label="Фактический пользователь" required>
                    <n-input/>
                </n-form-item>

                <n-form-item label="Рабочие группы" required>
                    <n-select :options="workGroupOptions" filterable multiple/>
                </n-form-item>
            </section>
        </n-form>
    </div>
</template>

<script lang="ts" setup>
import {type Ref, ref} from 'vue'
import {strapiApi} from "@/app/api/api";
import {useWorkGroupStore} from "@data/store/workGroupStore";
import {Realty} from "@data/models/Realty"

const props = defineProps<{
    realtyItem: Realty
}>()
const emit = defineEmits(['recognize'])

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

const locationType: Ref<string> = ref<string>('address')
const workGroupStore = useWorkGroupStore()
workGroupStore.loadAllWorkGroups()

const workGroupOptions = computed(() => {
    return workGroupStore.workGroups.map(wg => ({label: wg.title, value: wg.id}))
})

const buildingTypes = ref([])

strapiApi.get('building-types').then(r => {
    buildingTypes.value = r.data.data.map((t: any) => ({label: t.attributes.title, value: t.id}))
})


onMounted(() => {
    //@ts-ignore
    ymaps.ready(init);

    function init() {
        //@ts-ignore
        let myMap = new ymaps.Map("map", {
            center: [55.76, 37.64],
            zoom: 7
        });
    }
})
</script>

<style scoped>

</style>