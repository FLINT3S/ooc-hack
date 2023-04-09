import {BaseModel} from "@data/models/common/BaseModel";
import {Entity} from "@data/decorators/Entity";
import {Column} from "../decorators/Column";
import {API} from "@data/models/common/api/API";

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
}