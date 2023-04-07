import {createApp} from 'vue'
import {router} from "@/app/providers/router/router";
import {store} from "@/app/providers/store/pinia";

import App from './app/App.vue'
import './app/style/index.css'

createApp(App)
    .use(store)
    .use(router)
    .mount('#app')
