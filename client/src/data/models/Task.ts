import {BaseModel} from "@data/models/common/BaseModel";
import {Entity} from "@data/decorators/Entity";
import {Column} from "../decorators/Column";
import {API} from "@data/models/common/api/API";
import {AdditionalModelFields} from "@data/types/additionalModelFields";
import {WorkGroup} from "@data/models/WorkGroup";

@Entity()
export class Task extends BaseModel {
    api = new API('tasks')

    @Column({type: Date})
    deadline?: Date

    @Column()
    description?: string

    @Column()
    status!: 'pending' | 'in_progress' | 'review' | 'need_correction' | 'done'

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

    validate() {
        return !!(this.deadline &&
            this.status &&
            this.title &&
            this.realEstate &&
            this.assignee)
    }
}