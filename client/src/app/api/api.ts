import axios from "axios";

export const strapiApi = axios.create({
    baseURL: import.meta.env.PROD ?
        'https://strapi.ooc.flint3s.ru/api' :
        'https://2198-178-71-66-26.eu.ngrok.io/api'
})

export const serverApi = axios.create(({
    baseURL: import.meta.env.PROD ?
        'https://ooc.flint3s.ru/api' :
        'https://localhost:5000/api'
}))