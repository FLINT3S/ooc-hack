<template>
    <div>
        <SearchPanelInput :search-data="searchData" @search="onClickSearch"/>
        <SearchPanelFilters :search-data="searchData"/>
    </div>
</template>

<script lang="ts" setup>
import SearchPanelInput from "@components/ui/search/SearchPanelInput.vue";
import SearchPanelFilters from "@components/ui/search/SearchPanelFilters.vue";
import {SearchDataType} from "@data/types/searchData";
import qs from "qs";

const router = useRouter()

const props = withDefaults(defineProps<{
    searchType?: 'realty' | 'tasks'
}>(), {
    searchType: 'realty'
})

const searchData: SearchDataType = reactive({
    searchQuery: router.currentRoute.value?.query?.searchQuery as string || '',
    searchType: router.currentRoute.value?.query?.searchType as string || props.searchType || 'realty',
    filters: {
        area: router.currentRoute.value?.query?.['filters[area]'] as string || '',
        district: router.currentRoute.value?.query?.['filters[district]'] as string || ''
    }
})


const onClickSearch = () => {
    if (searchData.searchType === 'realty') {
        router.push('/realty/list?' + qs.stringify(searchData))
    } else {
        router.push('/tasks/list?' + qs.stringify(searchData))
    }
}
</script>