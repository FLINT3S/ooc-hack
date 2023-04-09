import {BaseModel} from "@data/models/common/BaseModel";
import {Entity} from "@data/decorators/Entity";
import {Column} from "@data/decorators/Column";
import {AdditionalRealtyFields} from "@data/types/additionalRealtyFields";
import {API} from "@data/models/common/api/API";
import { BuildingType } from "./nested/BuildingType";

@Entity()
export class Realty extends BaseModel {
    api = new API('real-estates')

    @Column()
    federalDistrict?: string

    @Column()
    region?: string

    @Column()
    address?: string

    @Column()
    objectState?: string

    @Column()
    area?: string

    @Column()
    owner?: string

    @Column({extractMethod: 'strapi'})
    buildingType?: BuildingType

    @Column()
    actualUser?: string

    @Column()
    additionalFields?: AdditionalRealtyFields
}