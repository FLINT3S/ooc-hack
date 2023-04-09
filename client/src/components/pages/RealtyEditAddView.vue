<template>
    <div class="container mt-5">
        <return-to-home-btn to="back">
            Вернуться к результатам поиска
        </return-to-home-btn>
    </div>
</template>

<script lang="ts" setup>
import ReturnToHomeBtn from "@components/ui/widgets/ReturnToHomeBtn.vue";

const router = useRouter()
const mode = router.currentRoute.value.path.includes('edit') ? 'edit' : 'add'
</script>

<style scoped>

</style>