import {BaseModel} from "@data/models/common/BaseModel";
import {Entity} from "@data/decorators/Entity";
import {API} from "@data/models/common/api/API";
import {Column} from "@data/decorators/Column";

@Entity()
export class Client extends BaseModel {
    api = new API('clients')

    @Column()
    name!: string

    @Column()
    surname!: string

    @Column()
    telegramId?: string

    @Column()
    role!: string

    @Column()
    email!: string

    get fullName() {
        return this.name + ' ' + this.surname
    }
}