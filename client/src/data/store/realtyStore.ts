import {defineStore} from "pinia";
import {Realty} from "@data/models/Realty";
import {useStrapiListFetch} from "@data/utils/strapiListFetch";
import {ListMeta} from "../types/ListMeta";
import {strapiApi} from "@/app/api/api";

export const useRealtyStore = defineStore('realty', {
    state() {
        return {
            realtyRegistry: [] as Realty[],
            realtyMeta: {} as ListMeta
        }
    },
    actions: {
        async loadAllRealty(page: number) {
            const res = (await useStrapiListFetch(Realty, {
                populate: '*',
                pagination: {pageSize: 1000}
            }))
            this.realtyRegistry = res.entries
            this.realtyMeta = res.meta
        },
        async searchByQuery(q: string) {
            const res = (await strapiApi.get('/fuzzy-search/search?query=' + q + '&populate=*')).data as any
            this.realtyRegistry = res['real-estates'].map((r: any) => new Realty().fromJSON(r)) as Realty[]
            this.realtyMeta.pagination.total = this.realtyRegistry.length
        }
    }
})