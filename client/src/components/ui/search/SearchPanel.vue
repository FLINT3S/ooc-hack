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

const searchData: SearchDataType = reactive({
    searchQuery: '',
    searchType: 'realty',
    filters: {
        area: '',
        district: ''
    }
})

const onClickSearch = () => {
    console.log(searchData)
}
</script>