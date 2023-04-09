import {BaseModel} from "@data/models/common/BaseModel";
import {Entity} from "@data/decorators/Entity";
import { Column } from "../decorators/Column";

@Entity()
export class Task extends BaseModel {
    @Column({type: Date})
    deadline?: Date

    @Column()
    description?: string

    @Column()
    status?: string

    @Column()
    title?: string
}