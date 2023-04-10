import {defineStore} from "pinia";
import {Meeting} from "@data/models/Meeting";
import {useStrapiListFetch} from "@data/utils/strapiListFetch";
import {Notification} from "@data/models/Notification";
import {useRootStore} from "@data/store/rootStore";

export const useMeetingStore = defineStore('meeting', {
    state() {
        return {
            meetings: [] as Meeting[]
        }
    },
    actions: {
        async loadAllMeetings() {
            const res = (await useStrapiListFetch(Meeting, {
                populate: '*',
                pagination: {pageSize: 1000},
                filter: {
                    task: {
                        workGroups: {
                            clients: {
                                $contains: useRootStore().currentUser.id
                            }
                        }
                    }
                },
            }))
            this.meetings = res.entries
        },
    }
})
