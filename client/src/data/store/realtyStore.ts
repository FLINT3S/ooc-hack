import {defineStore} from "pinia";
import {Realty} from "@data/models/Realty";
import {useStrapiListFetch} from "@data/utils/strapiListFetch";
import {ListMeta} from "../types/ListMeta";

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
        }
    }
})