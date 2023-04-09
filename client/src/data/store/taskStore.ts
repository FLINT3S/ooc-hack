import {defineStore} from "pinia";
import {Task} from "@data/models/Task";
import {ListMeta} from "@data/types/ListMeta";
import {useStrapiListFetch} from "@data/utils/strapiListFetch";
import {Realty} from "@data/models/Realty";
import {strapiApi} from "@/app/api/api";

export const useTaskStore = defineStore('task', {
    state() {
        return {
            tasksRegistry: [] as Task[],
            tasksMeta: {} as ListMeta
        }
    },
    actions: {
        async loadAllTasks(page: number) {
            const res = (await useStrapiListFetch(Task, {
                populate: '*',
                pagination: {pageSize: 1000}
            }))
            this.tasksRegistry = res.entries
            this.tasksMeta = res.meta
        },
        async searchByQuery(q: string) {
            const res = (await strapiApi.get('/fuzzy-search/search?query=' + q + '&populate=*')).data as any
            this.tasksRegistry = res['tasks'].map((r: any) => new Task().fromJSON(r)) as Task[]
            this.tasksMeta.pagination.total = this.tasksRegistry.length
        }
    }
})