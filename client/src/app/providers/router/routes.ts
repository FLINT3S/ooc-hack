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
        redirect: '/tasks/list',
        meta: {
            layout: MainLayout
        },
        children: [
            {
                path: 'list',
                component: () => import("@pages/tasks/TasksRegistryView.vue"),
            },
            {
                path: 'add',
                component: () => import("@pages/tasks/TaskEditAddView.vue"),
            },
            {
                path: 'edit/:id',
                component: () => import("@pages/tasks/TaskEditAddView.vue"),
            }
        ]
    },
    {
        path: '/realty',
        redirect: '/realty/list',
        meta: {
            layout: MainLayout
        },
        children: [
            {
                path: 'list',
                component: () => import("@pages/realty/RealtyRegistryView.vue"),
            },
            {
                path: 'add',
                component: () => import("@pages/realty/RealtyEditAddView.vue"),
            },
            {
                path: 'edit/:id',
                component: () => import("@pages/realty/RealtyEditAddView.vue"),
            }
        ]
    }
]