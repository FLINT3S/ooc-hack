import axios from "axios";

export const strapiApi = axios.create({
    baseURL: import.meta.env.PROD ?
        'https://strapi.ooc.flint3s.ru/api' :
        'https://strapi.ooc.flint3s.ru/api'
})

export const serverApi = axios.create(({
    baseURL: import.meta.env.PROD ?
        'https://ooc.flint3s.ru/api' :
        'https://ooc.flint3s.ru/api'
}))