import {API} from "@data/models/common/api/API";
import {Column} from "@data/decorators/Column";


export abstract class BaseModel {
    // Definition to specify api path and methods
    protected api!: Partial<API<BaseModel>>
    // Definition to use $api from models prototype
    public static $api: API<BaseModel>
    // Uses as inner api to work with instance
    get _api() {
        // @ts-ignore
        const __api = this.constructor.$api

        if (!__api) throw new Error(`API is not defined for ${this.constructor.name}`)

        return __api as API<BaseModel>
    }

    @Column()
    id!: string | number

    @Column({type: Date})
    createdAt?: Date

    @Column({type: Date})
    updatedAt?: Date


    constructor(id: string = null as unknown as string) {
        this.id = id
    }

    public fromJSON(json: object): this {
        const unknownJson: unknown = json;
        const __metadata = Reflect.getMetadata("columns", this.constructor)

        if (unknownJson === null ||
            Array.isArray(unknownJson) ||
            typeof unknownJson !== "object") {

            return this
        }

        for (const thisProp in this) {
            if (thisProp === "api") continue

            const _propMetadata = __metadata[thisProp]
            const _propType = _propMetadata?.type
            const _propValue = (unknownJson as any)[thisProp]

            if (_propType) {
                if (Array.isArray(_propValue)) {
                    this[thisProp] = _propValue.map((item: any) => new _propType[0]().fromJSON(item)) as any
                } else if (new _propType() instanceof BaseModel) {
                    this[thisProp] = new _propType().fromJSON(_propValue)
                } else if (_propValue !== undefined && _propType !== String) {
                    this[thisProp] = new _propType(_propValue)
                }
            } else {
                if (!_propMetadata.extractMethod) {
                    this[thisProp] = _propValue
                } else {
                    this[thisProp] = _propValue?.data ? {id: _propValue?.data?.id, ..._propValue?.data?.attributes} : null
                }
            }
        }

        return this
    }

    get json() {
        const __metadata = Reflect.getMetadata("columns", this.constructor)
        const json: any = {}

        for (const thisProp in this) {
            if (thisProp === "api") continue

            const _propMetadata = __metadata[thisProp]
            const _propType = _propMetadata?.type
            const _propValue = this[thisProp]

            if (_propMetadata?.excludeFromJSON) continue

            if (_propType) {
                if (Array.isArray(_propValue)) {
                    json[thisProp] = _propValue.map((item: any) => item.json)
                } else if (new _propType() instanceof BaseModel) {
                    // @ts-ignore
                    json[thisProp] = _propValue.json
                } else {
                    json[thisProp] = _propValue
                }
            } else {
                json[thisProp] = _propValue
            }
        }

        return json
    }

    async load() {
        if (!this.id) {
            return Promise.reject(new Error("Model id is not defined"))
        }

        this.api.fetching = true
        this.fromJSON(await this._api.getById!(this.id))
        this.api.fetching = false

        return this
    }

    async create() {
        const _r = await this._api.create!(this)

        return this.fromJSON({..._r.data.attributes, id: _r.data.id})
    }

    async update() {
        return await this._api.update!(this)
    }

    async delete() {
        await this._api.delete!(this.id)
    }
}
