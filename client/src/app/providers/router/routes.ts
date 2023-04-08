import MainLayout from "@components/layout/MainLayout.vue";
import {RouteRecordRaw} from "vue-router";

export const routes: RouteRecordRaw[] = [
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    },
    {
        path: '/login',
        component: () => import("@pages/AuthView.vue")
    },
    {
        path: '/',
        component: () => import('@pages/HomeView.vue'),
        meta: {
            layout: MainLayout
        }
    },
    {
        path: '/tasks',
        component: () => import("@pages/TasksRegistryView.vue"),
        meta: {
            layout: MainLayout
        }
    },
    {
        path: '/realty',
        component: () => import("@pages/RealtyRegistryView.vue"),
        meta: {
            layout: MainLayout
        }
    }
]