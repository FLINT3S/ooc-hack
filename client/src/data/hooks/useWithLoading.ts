import {ref} from "vue";

export const useWithLoading = (defaultValue = false) => {
    const loading = ref(defaultValue)
    const withLoading = async (callback: Function) => {
        loading.value = true
        try {
            return await callback()
        } catch (e) {
            throw e
        } finally {
            loading.value = false
        }
    }

    return {loading, withLoading}
}