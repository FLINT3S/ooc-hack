<template>
    <div>
        <SearchPanelInput/>
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
</script>