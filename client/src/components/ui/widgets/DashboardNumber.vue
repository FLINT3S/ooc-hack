<template>
    <div class="d-flex align-items-center">
        <slot>
            <svg fill="none" height="26" style="" viewBox="0 0 30 26" width="30"
                 xmlns="http://www.w3.org/2000/svg">
                <path d="M14.9999 5.98669L25.0399 23.3333H4.95992L14.9999 5.98669ZM14.9999 0.666687L0.333252 26H29.6666L14.9999 0.666687ZM16.3333 19.3333H13.6666V22H16.3333V19.3333ZM16.3333 11.3334H13.6666V16.6667H16.3333V11.3334Z"
                      fill="#696969"/>
            </svg>
        </slot>

        <div class="ms-3">
            <p class="text-secondary">{{ title }}</p>
            <span>{{ number }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    title: string,
    number: string | number
}

const props = defineProps<Props>()
</script>