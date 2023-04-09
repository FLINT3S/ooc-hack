import axios from "axios";

export const strapiApi = axios.create({
    baseURL: import.meta.env.PROD ?
        'https://strapi.ooc.flint3s.ru/api' :
        'https://ea12-178-71-66-26.ngrok-free.app/api'
})

export const serverApi = axios.create(({
    baseURL: import.meta.env.PROD ?
        'https://ooc.flint3s.ru/api' :
        'https://ooc.flint3s.ru/api'
}))