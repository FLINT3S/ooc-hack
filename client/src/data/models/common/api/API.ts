import {BaseModel} from "../BaseModel"
import {apiInstance} from "@/app/api/api";

type method = "all" | "create" | "update" | "delete" | "getAll" | "getById"

export class API<T extends BaseModel> {
    constructor(
        public path: string,
        public methods: "all" | method[] = "all",
        public fetching: boolean = false,
    ) {
        if (methods === "all") {
            this.methods = ["create", "update", "getById", "getAll", "delete"]
        }
    }

    async getById(id: T["id"]) {
        if (!this.methods.includes("getById")) {
            return Promise.reject(new Error("Method getById are not available"))
        }

        return (await apiInstance.get(`${this.path}/${id}`)).data
    }

    async getAll(options: any = {}) {
        if (!this.methods.includes("getAll")) {
            return Promise.reject(new Error("Method getAll are not available"))
        }

        return (await apiInstance.get(this.path)).data
    }

    async create(data: T) {
        if (!this.methods.includes("create")) {
            return Promise.reject(new Error("Method create are not available"))
        }

        const _t = data.json
        delete _t.id

        return (await apiInstance.post(this.path, {data: _t})).data
    }

    async update(data: T) {
        if (!this.methods.includes("update")) {
            return Promise.reject(new Error("Method update are not available"))
        }

        return (await apiInstance.put(`${this.path}/${data.id}`, data.json)).data
    }

    async delete(id: T["id"]) {
        if (!this.methods.includes("delete")) {
            return Promise.reject(new Error("Method delete are not available"))
        }

        return (await apiInstance.delete(this.path + "/delete/" + id)).data
    }

    async reorder(id: string, newOrder: number) {
        return (await apiInstance.post(this.path + "/reorder", {id, newOrder})).data
    }
}
