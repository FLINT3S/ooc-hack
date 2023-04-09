export const useStrapiListFetch = async (model: object, params: any = {}) => {
    // @ts-ignore
    const res = (await model.$api.getAll(params))

    return {
        entries: res.data
            .map((r: any) => ({id: r.id, ...r.attributes}))
            // @ts-ignore
            .map((r: any) => new model().fromJSON(r)),
        meta: res.meta
    }
}