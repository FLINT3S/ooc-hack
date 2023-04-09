import {defineStore} from "pinia";
import {Client} from "@data/models/Client";
import {useStrapiListFetch} from "@data/utils/strapiListFetch";

export const useClientStore = defineStore('client', {
    state() {
        return {
            clients: [] as Client[]
        }
    },
    actions: {
        async loadAllClients() {
            const res = (await useStrapiListFetch(Client, {
                populate: '*',
                pagination: {pageSize: 1000}
            }))
            this.clients = res.entries
        }
    }
})