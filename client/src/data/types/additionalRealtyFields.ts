export type AdditionalRealtySection = {
    fields: {
        type: string,
        value: any,
        title: string
    }[],
    sectionTitle: string
}

export type AdditionalRealtyFields = AdditionalRealtySection[]