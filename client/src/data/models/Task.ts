import {BaseModel} from "@data/models/common/BaseModel";
import {Entity} from "@data/decorators/Entity";
import {Column} from "../decorators/Column";
import {API} from "@data/models/common/api/API";
import {AdditionalModelFields} from "@data/types/additionalModelFields";

@Entity()
export class Task extends BaseModel {
    api = new API('tasks')

    @Column({type: Date})
    deadline?: Date

    @Column()
    description?: string

    @Column()
    status?: string

    @Column()
    title?: string

    @Column({extractMethod: 'strapi'})
    realEstate?: any

    @Column({extractMethod: 'strapi'})
    assignee?: any

    @Column()
    additionalFields?: AdditionalModelFields = []

    validate() {
        return !!(this.deadline &&
            this.status &&
            this.title &&
            this.realEstate &&
            this.assignee)
    }
}