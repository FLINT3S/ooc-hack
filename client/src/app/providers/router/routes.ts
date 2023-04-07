import MainLayout from "@components/layout/MainLayout.vue";
import {RouteRecordRaw} from "vue-router";

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('@pages/HomeView.vue'),
        meta: {
            layout: MainLayout
        }
    },
    {
        path: '/login',
        component: () => import("@pages/LoginView.vue")
    }
]