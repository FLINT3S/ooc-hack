<template>
    <div class="login-view">
        <n-card content-style="padding: 0; display: flex" style="width: fit-content; overflow: hidden; height: 50vh;">
            <img class="login-img" src="@/assets/images/login-bg.png"/>
            <div class="p-3 login-content d-flex flex-column">
                <div class="d-flex justify-content-center">
                    <img alt="" src="@/assets/images/gin-logo.svg">
                    <div class="text-center my-auto lh-1 ms-3">
                        <h1 class="app-title my-0">
                            ГИН Ассистент
                        </h1>
                    </div>
                </div>

                <n-form
                        :model="loginData"
                        :rules="loginFormRules"
                        class="my-auto"
                        ref="loginFormRef"
                >
                    <n-form-item
                            label="Доменный email"
                            path="email"
                            required
                    >
                        <n-input
                                v-model:value="loginData.email"
                                placeholder="admin@gin.mos.ru"
                        />
                    </n-form-item>

                    <n-form-item
                            label="Пароль"
                            path="password"
                            required
                    >
                        <n-input
                                v-model:value="loginData.password"
                                placeholder="•••"
                                type="password"
                        />
                    </n-form-item>

                    <n-form-item
                        :feedback="loginError"
                        validation-status="error"
                    >
                        <n-button
                                :disabled="isLoginDisabled"
                                :loading="loading"
                                block
                                class="mt-3"
                                @click="onClickSubmitLogin"
                        >
                            Войти
                        </n-button>
                    </n-form-item>
                </n-form>
            </div>
        </n-card>
    </div>
</template>

<script lang="ts" setup>
import {computed, reactive, ref} from "vue";
import {serverApi} from "@/app/api/api";
import {type FormItemRule, useMessage} from "naive-ui"
import {useSetLoadingGlobal} from "@data/hooks/useSetLoading";
import {validateEmail} from "@data/utils/emailValidate";

const message = useMessage()
const loginFormRef = ref()

const loginData = reactive({
    email: '',
    password: ''
})

const loginFormRules = {
    email: {
        required: true,
        trigger: 'blur',
        validator (rule: FormItemRule, value: string) {
            if (!value) {
                return new Error('Обязательное поле')
            }
            if (!validateEmail(value)) {
              return new Error('Введите корректную почту')
            }
            return true
          },
    },
    password: {
        required: true,
        message: 'Обязательное поле',
        trigger: 'blur'
    }
}

const {loading, withLoading} = useSetLoadingGlobal()
const loginError = ref("")

const isLoginDisabled = computed(() => {
    return !(loginData.email && loginData.password && validateEmail(loginData.email))
})

const onClickSubmitLogin = () => {
    withLoading(serverApi.post('/login', loginData))
        .then((res) => {
            console.log(res)
        })
        .catch((e) => {
            onRejectLogin(e.message)
        })
}

const onRejectLogin = (error: string) => {
    loginError.value = error
    message.error(`Ошибка логина! ${error}`)
}
</script>

<style scoped>
.login-view {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-img {
    width: 350px;
    object-fit: cover;
}

.login-content {
    min-width: 400px;
}

.app-title {
    color: #B91827;
    font-size: 18px;
}
</style>