<template>
    <div class="d-flex justify-content-between mt-3">
        <div class="d-flex">
            <span>
                Поиск по:&nbsp;
            </span>

            <n-popselect v-model:value="searchData.searchType" :options="options" trigger="click">
                <div class="d-flex align-items-center cursor-pointer">
                <span class="text-accent">
                    {{ searchType.label }}
                </span>
                    <svg class="ms-1" fill="var(--accent-red)" height="5" style="" viewBox="0 0 10 5" width="8"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0L5 5L10 0H0Z"/>
                    </svg>
                </div>
            </n-popselect>
        </div>

        <search-advanced-filters v-if="searchType.value === 'realty'" :search-data="searchData"/>
    </div>
</template>

<script lang="ts" setup>
import SearchAdvancedFilters from "@components/ui/search/SearchAdvancedFilters.vue";
import {SearchDataType} from "@data/types/searchData";

const options = [
    {
        label: 'объектам недвижимости',
        value: 'realty'
    },
    {
        label: 'поручениям',
        value: 'tasks'
    }
]

interface Props {
    searchData: SearchDataType
}

const props = defineProps<Props>()

const searchType = computed(() => {
    return options.find((o) => o.value === props.searchData.searchType)!
})
</script>