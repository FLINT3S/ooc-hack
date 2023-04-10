import {BaseModel} from "@data/models/common/BaseModel";
import {Entity} from "@data/decorators/Entity";
import {API} from "@data/models/common/api/API";
import {Client} from "./Client";
import {Column} from "@data/decorators/Column";

@Entity()
export class TaskHistory extends BaseModel {
    api = new API('task-histories')

    @Column({type: Client})
    client!: Client

    @Column()
    description!: string

    @Column()
    task!: number
}