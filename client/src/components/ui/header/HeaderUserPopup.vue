<template>
    <n-popover
            :show-arrow="false"
            placement="bottom-end"
            style="padding: 3px; width: 150px"
            trigger="click"
    >
        <template #trigger>
            <div class="header-icon d-flex align-items-center">
                <UserIcon/>

                <p class="mx-1">
                    {{ root.currentUser?.name }}
                </p>

                <svg fill="none" height="5" style="" viewBox="0 0 10 5" width="10" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0L5 5L10 0H0Z" fill="#A6A6A6"/>
                </svg>
            </div>
        </template>

        <n-list :show-divider="false" clickable hoverable>
            <n-list-item class="px-3 py-1" @click="onClickSettingsBtn">
                <div class="d-flex align-items-center justify-content-start">
                    <SettingsIcon/>
                    <span class="ms-2">
                        Настройки
                    </span>
                </div>
            </n-list-item>

            <n-list-item class="px-3 py-1" @click="onClickLogoutBtn">
                <div class="d-flex align-items-center justify-content-start" style="color: var(--accent-red)">
                    <LogOutOutlined width="24"/>
                    <span class="ms-2">
                        Выйти
                    </span>
                </div>
            </n-list-item>
        </n-list>
    </n-popover>

    <n-modal v-model:show="showSettingsModal" title="Настройки">
        <n-card
                :bordered="false"
                aria-modal="true"
                closable
                role="dialog"
                size="medium"
                style="width: 450px"
                title="Настройки"
                @close="showSettingsModal = false"
        >
            <n-form-item label="Тема">
                <n-select
                        v-model:value="currentTheme"
                        :options="themeOptions"
                />
            </n-form-item>
        </n-card>
    </n-modal>
</template>

<script lang="ts" setup>
import {LogOutOutlined} from "@vicons/material"
import SettingsIcon from "@components/ui/icons/SettingsIcon.vue";
import UserIcon from "@components/ui/icons/UserIcon.vue";
import {useRootStore} from "@data/store/rootStore";
import {ref} from "vue"
import {ColorAppTheme} from "@data/types/theme";

const dialog = useDialog()
const router = useRouter()
const root = useRootStore()

const themeOptions = [
    {
        label: 'Светлая тема',
        value: 'light'
    },
    {
        label: 'Тёмная тема',
        value: 'dark'
    }
]

const currentTheme = computed({
    get(): ColorAppTheme {
        return root.theme
    },
    set(theme: ColorAppTheme) {
        root.setTheme(theme)
    }
})


const showSettingsModal = ref(false)
const onClickSettingsBtn = () => {
    showSettingsModal.value = true
}

const onClickLogoutBtn = () => {
    dialog.error({
        title: "Выход из системы",
        content: "Вы действительно хотите выйти?",
        positiveText: "Да, выйти",
        onPositiveClick: () => {
            router.replace("/logout")
        }
    })
}
</script>