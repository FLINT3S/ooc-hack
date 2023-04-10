import {Entity} from "@data/decorators/Entity";
import {BaseModel} from "@data/models/common/BaseModel";
import {WorkGroup} from "@data/models/WorkGroup";
import {Column} from "@data/decorators/Column";
import {API} from "@data/models/common/api/API";

@Entity()
export class Notification extends BaseModel {
    api = new API('notifications')

    @Column({type: WorkGroup})
    workGroup!: WorkGroup

    @Column()
    title!: string

    @Column()
    text?: string

    @Column()
    date?: string
}