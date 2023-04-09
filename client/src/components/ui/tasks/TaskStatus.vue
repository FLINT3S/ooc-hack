<template>
    <div :class="status" class="task-status d-inline">
        {{statusMapping[status]}}
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    status: 'pending' | 'in_progress' | 'review' | 'need_correction' | 'done'
}>()

const statusMapping = {
    pending: 'Ожидает',
    in_progress: 'В работе',
    review: 'На проверке',
    need_correction: 'Требуется уточнение',
    done: 'Завершено'
}
</script>

<style scoped>
.task-status {
    padding: 5px 10px;
    border-radius: 10px;
}

.pending {
    background: #D9D9D9;
    color: #636363;
}

.in-progress {
    background: #C1E1FF;
    color: #2A659B;
}

.review {
    background: #F2DCA4;
    color: #896200;
}

.need_correction {
    background: #FBB2B2;
    color: #901818;
}

.done {
    background: #AEDEC1;
    color: #007327;
}
</style>