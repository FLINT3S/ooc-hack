import {defineStore} from "pinia";
import {WorkGroup} from "@data/models/WorkGroup";
import {useStrapiListFetch} from "@data/utils/strapiListFetch";
import {Realty} from "@data/models/Realty";
import {ListMeta} from "@data/types/ListMeta";

export const useWorkGroupStore = defineStore('work-groups', {
    state() {
        return {
            workGroups: [] as WorkGroup[],
            workGroupsMeta: {} as ListMeta
        }
    },
    actions: {
        async loadAllWorkGroups() {
            const res = (await useStrapiListFetch(WorkGroup, {
                populate: '*',
                pagination: {pageSize: 1000}
            }))
            this.workGroups = res.entries
            this.workGroupsMeta = res.meta
        },
    }
})