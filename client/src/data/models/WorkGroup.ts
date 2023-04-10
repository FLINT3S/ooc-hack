import {BaseModel} from "@data/models/common/BaseModel";
import {Entity} from "@data/decorators/Entity";
import {Column} from "@data/decorators/Column";
import {API} from "@data/models/common/api/API";
import {Client} from "@data/models/Client";

@Entity()
export class WorkGroup extends BaseModel {
    api = new API('work-groups')

    @Column()
    title?: string

    @Column({type: [Client]})
    clients: Client[] = []
}