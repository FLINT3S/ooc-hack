<template>
    <div class="d-flex align-items-center text-accent cursor-pointer" @click="showFiltersModal = true">
        <div class="filters-count" v-if="filtersCount">
            {{filtersCount}}
        </div>

        <span class="ms-2 me-1">
            Параметры поиска
        </span>

        <svg fill="none" height="12" style="" viewBox="0 0 20 14" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H1C0.45 4 0 3.55 0 3C0 2.45 0.45 2 1 2H4C4.55 2 5 2.45 5 3C5 3.55 4.55 4 4 4ZM4 7H1C0.45 7 0 7.45 0 8C0 8.55 0.45 9 1 9H4C4.55 9 5 8.55 5 8C5 7.45 4.55 7 4 7ZM17.88 13.29L14.76 10.17C13.9 10.73 12.87 11.05 11.76 10.99C9.39 10.88 7.36 9.03 7.04 6.68C6.93439 5.89894 7.01444 5.10397 7.27365 4.35964C7.53287 3.6153 7.96394 2.94258 8.53188 2.39607C9.09982 1.84957 9.78862 1.44468 10.5424 1.21427C11.2961 0.98387 12.0936 0.934443 12.87 1.07C14.82 1.4 16.44 2.92 16.87 4.85C17.2 6.31 16.88 7.67 16.17 8.75L19.3 11.88C19.69 12.27 19.69 12.9 19.3 13.29C18.91 13.68 18.27 13.68 17.88 13.29ZM15 6C15 4.35 13.65 3 12 3C10.35 3 9 4.35 9 6C9 7.65 10.35 9 12 9C13.65 9 15 7.65 15 6ZM1 14H9C9.55 14 10 13.55 10 13C10 12.45 9.55 12 9 12H1C0.45 12 0 12.45 0 13C0 13.55 0.45 14 1 14Z"
                  fill="#B91827"/>
        </svg>
    </div>

    <n-modal v-model:show="showFiltersModal">
        <n-card
                style="width: 500px"
                title="Параметры поиска"
                closable
                @close="showFiltersModal = false"
        >
            <n-form-item label="Область">
                <n-input v-model:value="searchData.filters.area">
                </n-input>
            </n-form-item>

            <n-form-item label="Район">
                <n-input v-model:value="searchData.filters.district">
                </n-input>
            </n-form-item>

            <n-button type="primary" block @click="showFiltersModal = false">
                Сохранить
            </n-button>
        </n-card>
    </n-modal>
</template>

<script lang="ts" setup>
import {SearchDataType} from "@data/types/searchData";

interface Props {
    searchData: SearchDataType
}

const props = defineProps<Props>()

const showFiltersModal = ref(false)

const filtersCount = computed(() => {
    return Object.keys(props.searchData.filters).filter((f: any) => {
        // @ts-ignore
        return props.searchData.filters[f] !== '';
    }).length
})
</script>

<style scoped>
.filters-count {
    width: 20px;
    height: 20px;
    text-align: center;
    color: white;
    border-radius: 100px;
    background: var(--accent-red);
}
</style>