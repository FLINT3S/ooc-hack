export type AdditionalModelSection = {
    fields: {
        type: string,
        value: any,
        title: string
    }[],
    sectionTitle: string
}

export type AdditionalModelFields = AdditionalModelSection[]