import {defineStore} from "pinia";
import {ColorAppTheme} from "@data/types/theme";
import {Client} from "@data/models/Client";
import {serverApi, strapiApi} from "@/app/api/api";

export const useRootStore = defineStore("root", {
    state() {
        return {
            theme: 'light' as ColorAppTheme,
            currentUser: null as unknown as Client
        }
    },
    actions: {
        initTheme() {
            this.setTheme(localStorage.getItem('app-theme') as ColorAppTheme || 'light')
        },
        setTheme(theme: ColorAppTheme) {
            this.theme = theme
            document.documentElement.setAttribute('theme', theme)
            localStorage.setItem('app-theme', theme)
        },
        async login(loginData: { password: string, email: string }) {
            const res = (await serverApi.post('/auth/login', loginData)).data

            if (!res?.apiKey) {
                return Promise.reject('Неверный логин или пароль')
            } else {
                strapiApi.defaults.headers['Authorization'] = `bearer ${res.apiKey}`
                serverApi.defaults.headers['Authorization'] = res.access_token

                const clientId = (await strapiApi.get(`/clients?filters[email][$eq]=${loginData.email}`)).data.data?.[0]?.id

                if (!clientId) {
                    return Promise.reject('Пользователь не найден')
                }

                this.currentUser = await new Client(clientId).load()

                localStorage.setItem('currentClientId', clientId)
                localStorage.setItem('strapiApiKey', res.apiKey)
                localStorage.setItem('serverToken', res.access_token)
            }
        },
        async restoreLogin() {
            const apiKey = localStorage.getItem('strapiApiKey')
            const accessToken = localStorage.getItem('serverToken')
            const currentUserId = parseInt(localStorage.getItem('currentClientId') || '')


            if (apiKey && accessToken && currentUserId) {
                this.currentUser = await new Client(currentUserId).load()
                strapiApi.defaults.headers['Authorization'] = `bearer ${apiKey}`
                serverApi.defaults.headers['Authorization'] = accessToken

                return Promise.resolve()
            }

            return Promise.reject()
        }
    }
})