import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
// @ts-ignore
import AutoImport from 'unplugin-auto-import/vite'
// @ts-ignore
import Components from 'unplugin-vue-components/vite'
// @ts-ignore
import {NaiveUiResolver} from 'unplugin-vue-components/resolvers'

import path from 'path';

export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            imports: [
                'vue',
                {
                    'naive-ui': [
                        'useDialog',
                        'useMessage',
                        'useNotification',
                        'useLoadingBar'
                    ],
                    'vue-router': [
                        'useRouter',
                        'useRoute'
                    ]
                }
            ]
        }),
        Components({
            resolvers: [NaiveUiResolver()]
        })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, './src'),
            "@components": path.resolve(__dirname, './src/components'),
            "@pages": path.resolve(__dirname, './src/components/pages'),
            "@data": path.resolve(__dirname, './src/data'),
        }
    }
})
