import {createApp} from 'vue'
import {router} from "@/app/providers/router/router";
import {store} from "@/app/providers/store/pinia";

import App from './app/App.vue'
import './app/style/index.css'
import VueApexCharts from "vue3-apexcharts";

createApp(App)
    .use(store)
    .use(router)
    .use(VueApexCharts)
    .mount('#app')
