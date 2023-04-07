import {defineStore} from "pinia";

export const useRootStore = defineStore("root", {
    state() {
        return {
            theme: 'light'
        }
    },
    actions: {
        initTheme() {
            this.setTheme(localStorage.getItem('app-theme') as 'light' | 'dark' || 'light')
        },
        setTheme(theme: 'dark' | 'light') {
            this.theme = theme
            document.documentElement.setAttribute('theme', theme)
            localStorage.setItem('app-theme', theme)
        }
    }
})