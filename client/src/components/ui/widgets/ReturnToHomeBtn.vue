<template>
    <n-button @click="onClickBack" secondary>
        <template #icon>
            <n-icon>
                <svg fill="none" height="14" style="" viewBox="0 0 17 14" width="17" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 5L1 9M1 9L5 13M1 9H12C13.0609 9 14.0783 8.57857 14.8284 7.82843C15.5786 7.07828 16 6.06087 16 5C16 3.93913 15.5786 2.92172 14.8284 2.17157C14.0783 1.42143 13.0609 1 12 1H11"
                          stroke="#262626" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                </svg>
            </n-icon>
        </template>

        <slot>
            Вернуться на главную
        </slot>
    </n-button>
</template>

<script setup lang="ts">
const router = useRouter()

const props = withDefaults(defineProps<{to?: string}>(), {
    to: '/'
})

const onClickBack = () => {
    if (props.to === 'back') {
        router.back()
    } else {
        router.replace(props.to)
    }
}
</script>

<style scoped>

</style>