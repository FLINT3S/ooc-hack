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
                component: () => import("@pages/TasksRegistryView.vue"),
            },
            {
                path: 'byRealty/:realtyId',
                component: () => import("@pages/TaskByRealtyView.vue"),
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
                component: () => import("@pages/RealtyRegistryView.vue"),
            },
            {
                path: 'add',
                component: () => import("@pages/RealtyEditAddView.vue"),
            },
            {
                path: 'edit/:id',
                component: () => import("@pages/RealtyEditAddView.vue"),
            }
        ]
    }
]