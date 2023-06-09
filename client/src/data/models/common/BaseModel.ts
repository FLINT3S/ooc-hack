import {API} from "@data/models/common/api/API";
import {Column} from "@data/decorators/Column";


export abstract class BaseModel {
    // Definition to use $api from models prototype
    public static $api: API<BaseModel>
    @Column()
    id!: string | number
    @Column({type: Date})
    createdAt?: Date
    @Column({type: Date})
    updatedAt?: Date
    // Definition to specify api path and methods
    protected api!: Partial<API<BaseModel>>

    constructor(id: number = null as unknown as number) {
        this.id = id
    }

    // Uses as inner api to work with instance
    get _api() {
        // @ts-ignore
        const __api = this.constructor.$api

        if (!__api) throw new Error(`API is not defined for ${this.constructor.name}`)

        return __api as API<BaseModel>
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
                } else if (!Array.isArray(_propType) && new _propType() instanceof BaseModel) {
                    // @ts-ignore
                    json[thisProp] = _propValue?.json
                } else {
                    json[thisProp] = _propValue
                }
            } else {
                json[thisProp] = _propValue
            }
        }

        return json
    }

    public fromJSON(json: object): this {
        const unknownJson: unknown = json;
        const __metadata = Reflect.getMetadata("columns", this.constructor)

        if (unknownJson === null ||
            Array.isArray(unknownJson) ||
            typeof unknownJson !== "object") {

            return this
        }

        for (const __thisProp in this) {
            if (__thisProp === "api") continue

            const _propMetadata = __metadata[__thisProp]
            const _propType = _propMetadata?.type
            const thisProp = (_propMetadata?.jsonKey || __thisProp) as Extract<keyof this, string>

            const _propValue = (unknownJson as any)[thisProp]

            if (!_propValue) {
                this[thisProp] = _propValue
                continue
            }


            if (_propType) {
                if (Array.isArray(_propValue)) {
                    this[thisProp] = _propValue.map((item: any) => new _propType[0]().fromJSON(item)) as any
                } else if (Array.isArray(_propValue?.data)) {
                    this[thisProp] = _propValue.data.map((item: any) => new _propType[0]().fromJSON({id: item?.id, ...item?.attributes})) as any
                } else if (_propType && new _propType() instanceof BaseModel) {
                    this[thisProp] = new _propType().fromJSON({id: _propValue?.data?.id, ..._propValue?.data?.attributes})
                } else if (_propValue !== undefined && _propType !== String) {
                    this[thisProp] = new _propType(_propValue)
                }
            } else {
                if (!_propMetadata.extractMethod) {
                    this[thisProp] = _propValue
                } else if (_propMetadata.extractMethod === 'strapi-array') {
                    this[thisProp] = _propValue?.data ?
                        _propValue?.data.map((d: any) => ({id: d?.id, ...d?.attributes})) :
                        null
                } else {
                    this[thisProp] = _propValue?.data ? {id: _propValue?.data?.id, ..._propValue?.data?.attributes} : null
                }
            }
        }

        return this
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
