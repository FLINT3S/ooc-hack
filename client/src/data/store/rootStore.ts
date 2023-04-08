import {defineStore} from "pinia";
import {ColorAppTheme} from "@data/types/theme";

export const useRootStore = defineStore("root", {
    state() {
        return {
            theme: 'light' as ColorAppTheme
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
        }
    }
})