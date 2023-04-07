import {type Ref, ref} from "vue";

export const useSetLoadingGlobal = () => {
    const loading = ref(false)

    return {loading, withLoading: <T extends any>(promise: Promise<T>) => useSetLoading(promise, loading)}
}

export const useSetLoading = <T extends any>(promise: Promise<T>, loading: Ref<boolean>) => {
    loading.value = true

    return new Promise((resolve, reject) => {
        promise
            .then(resolve)
            .catch(reject)
            .finally(() => {
                loading.value = false
            })
    })
}