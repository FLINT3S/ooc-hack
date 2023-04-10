import {defineStore} from "pinia";
import {Notification} from "@data/models/Notification"
import {useStrapiListFetch} from "@data/utils/strapiListFetch";
import {useRootStore} from "@data/store/rootStore";

export const useNotificationStore = defineStore('notification', {
    state() {
        return {
            notifications: [] as Notification[]
        }
    },
    actions: {
        async loadAllNotifications() {
            const res = (await useStrapiListFetch(Notification, {
                populate: '*',
                pagination: {pageSize: 1000},
                filter: {
                    workGroup: {
                        clients: {
                            $contains: useRootStore().currentUser.id
                        }
                    }
                },
                sort: 'createdAt:desc'

            }))
            this.notifications = res.entries
        },
    }
})
