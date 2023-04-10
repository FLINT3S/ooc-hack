import {BaseModel} from "@data/models/common/BaseModel";
import {Entity} from "@data/decorators/Entity";
import {Column} from "@data/decorators/Column";
import {API} from "./common/api/API";
import { Task } from "./Task";

@Entity()
export class Meeting extends BaseModel {
    api = new API('meetings')

    @Column({type: Date})
    date!: Date

    @Column({type: [Task]})
    tasks: Task[] = []

    @Column()
    url!: string
}