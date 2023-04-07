<template>
    <div class="login-view">
        <n-card content-style="padding: 0; display: flex" style="width: fit-content; overflow: hidden; height: 50vh;">
            <img class="login-img" src="@/assets/images/login-bg.png"/>
            <div class="p-3 login-content d-flex flex-column">
                <div class="d-flex justify-content-center">
                    <img alt="" src="@/assets/images/gin-logo.svg">
                    <div class="text-center lh-1 ms-3">
                        <h1 class="app-title my-0">
                            Государственная инспекция
                            <br>
                            по недвижимости
                        </h1>
                        <h3 class="my-0 fw-light">Цифровой помощник</h3>
                    </div>
                </div>

                <n-form
                        :model="loginData"
                        :rules="loginFormRules"
                        class="my-auto"
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

                    <n-button
                            :disabled="isLoginDisabled"
                            :loading="loading"
                            block
                            class="mt-3"
                            @click="onClickSubmitLogin"
                    >
                        Войти
                    </n-button>
                </n-form>
            </div>
        </n-card>
    </div>
</template>

<script lang="ts" setup>
import {computed, reactive} from "vue";
import {serverApi} from "@/app/api/api";
import {type FormItemRule, useMessage} from "naive-ui"
import {useSetLoadingGlobal} from "@data/hooks/useSetLoading";
import {validateEmail} from "@data/utils/emailValidate";

const message = useMessage()

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
                return new Error('Обязательное поле!')
            }
            if (!validateEmail(value)) {
              return new Error('Введите корректную почту!')
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

const isLoginDisabled = computed(() => {
    return !(loginData.email && loginData.password)
})

const onClickSubmitLogin = () => {
    withLoading(serverApi.post('/login', loginData))
        .then((res) => {
            console.log(res)
        })
        .catch((e) => {
            onRejectLogin(e.message)
        })
        .finally(() => {
        })
}

const onRejectLogin = (error: string) => {
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