<template>
    <n-card>
        <template #header>
            <div class="d-flex justify-content-between">
                <router-link :to="upcomingEventsMode === 'realty' ? '/realty' : '/tasks'" class="d-flex align-items-center text-primary underline-hover-link">
                    <span class="me-2">{{ upcomingEventsMode === 'realty' ? 'Объекты' : 'Задачи' }} к ближайшему рассмотрению</span>
                    <ArrowRightIcon/>
                </router-link>

                <div style="font-size: 14px">
                    <n-popselect v-model:value="(upcomingEventsMode as string)" :options="options" trigger="click">
                        <div class="d-flex align-items-center cursor-pointer">
                            <span class="text-accent">
                                {{ upcomingEventsModeLabel }}
                            </span>

                            <DropdownIcon/>
                        </div>
                    </n-popselect>
                </div>
            </div>
        </template>

        <n-data-table>
            
        </n-data-table>
    </n-card>
</template>

<script lang="ts" setup>
import DropdownIcon from "@components/ui/icons/DropdownIcon.vue";
import ArrowRightIcon from "@components/ui/icons/ArrowRightIcon.vue";

const options = [
    {
        label: 'Объекты недвижимости',
        value: 'realty'
    },
    {
        label: 'Принятые решения',
        value: 'tasks'
    }
]

const upcomingEventsMode: Ref<string> = ref('realty')

const upcomingEventsModeLabel = computed(() => {
    return options.find(o => o.value === upcomingEventsMode.value)!.label
})
</script>