import {BaseModel} from "@data/models/common/BaseModel";
import {Entity} from "@data/decorators/Entity";
import {Column} from "@data/decorators/Column";
import {AdditionalModelFields} from "@data/types/additionalModelFields";
import {API} from "@data/models/common/api/API";
import {BuildingType} from "./nested/BuildingType";
import {Task} from "@data/models/Task";
import {WorkGroup} from "@data/models/WorkGroup";

@Entity()
export class Realty extends BaseModel {
    api = new API('real-estates')

    @Column()
    federalDistrict!: string

    @Column()
    region!: string

    @Column()
    address!: string

    @Column()
    coordinates: { lat: number, lon: number } = {lat: 0, lon: 0}

    @Column()
    objectState!: string

    @Column()
    area!: string

    @Column()
    owner!: string

    @Column({extractMethod: 'strapi'})
    buildingType!: BuildingType

    @Column()
    actualUser!: string

    @Column()
    additionalFields?: AdditionalModelFields = []

    @Column({type: [Task]})
    tasks: Task[] = []

    @Column({type: [WorkGroup]})
    workGroups: WorkGroup[] = []

    @Column({extractMethod: 'strapi-array'})
    attachments: any

    validate(): boolean {
        return !!(this.federalDistrict &&
            this.region &&
            this.address &&
            this.objectState &&
            this.area &&
            this.owner &&
            this.buildingType &&
            this.actualUser)
    }
}