<template>
    <div class="d-flex gap-1">
        <n-input placeholder="Введите адрес объекта или идентификационный номер">
            <template #prefix>
                <SearchPlaceholderIcon/>
            </template>
        </n-input>

        <n-button type="primary">
            Искать
        </n-button>
    </div>
</template>

<script lang="ts" setup>
import SearchPlaceholderIcon from "@components/ui/icons/SearchPlaceholderIcon.vue";
</script>