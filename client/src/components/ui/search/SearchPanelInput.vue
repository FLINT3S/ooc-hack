<template>
    <div class="d-flex gap-1">
        <n-input v-model:value="searchData.searchQuery" placeholder="Введите адрес объекта или идентификационный номер">
            <template #prefix>
                <SearchPlaceholderIcon/>
            </template>
        </n-input>

        <n-button type="primary" @click="emit('search')">
            Искать
        </n-button>
    </div>
</template>

<script lang="ts" setup>
import SearchPlaceholderIcon from "@components/ui/icons/SearchPlaceholderIcon.vue";
import {SearchDataType} from "@data/types/searchData";

const emit = defineEmits(['search'])

interface Props {
    searchData: SearchDataType
}

const props = defineProps<Props>()
</script>