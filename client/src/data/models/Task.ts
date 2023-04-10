import {BaseModel} from "@data/models/common/BaseModel";
import {Entity} from "@data/decorators/Entity";
import {Column} from "../decorators/Column";
import {API} from "@data/models/common/api/API";
import {AdditionalModelFields} from "@data/types/additionalModelFields";
import {WorkGroup} from "@data/models/WorkGroup";
import {TaskHistory} from "@data/models/TaskHistory";

@Entity()
export class Task extends BaseModel {
    api = new API('tasks')

    @Column({type: Date})
    deadline?: Date

    @Column()
    description?: string

    @Column()
    status: 'pending' | 'in_progress' | 'review' | 'need_correction' | 'done' = 'pending'

    @Column()
    title!: string

    @Column({extractMethod: 'strapi'})
    realEstate?: any

    @Column({extractMethod: 'strapi'})
    assignee?: any

    @Column()
    additionalFields?: AdditionalModelFields = []

    @Column({type: [WorkGroup]})
    workGroups?: WorkGroup[] = []

    @Column({extractMethod: 'strapi-array'})
    attachments: any

    @Column({extractMethod: 'strapi-array'})
    meetings: any = []

    @Column({type: [TaskHistory]})
    taskHistories: TaskHistory[] = []

    get nearestMeeting() {
        if (!this.meetings || !this.meetings.length) {
            return null
        }

        return this.meetings
            .filter((m: any) => {
                return (new Date(m.date).getTime() - new Date().getTime()) > 0
            })
            .sort((m1: any, m2: any) => {
                return new Date(m1.date).getTime() - new Date(m2.date).getTime()
            })[0]
    }

    validate() {
        return !!(this.deadline &&
            this.status &&
            this.title &&
            this.realEstate &&
            this.assignee)
    }
}