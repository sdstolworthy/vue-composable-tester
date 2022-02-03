import { onMounted, ref } from "vue";

export function useComposableFunction<T>(promiseCreator: () => Promise<T>) {
  const isLoading = ref(false);
  const data = ref<T>();
  const error = ref<object>();
  isLoading.value = true;
  promiseCreator()
    .then((newData) => {
      data.value = newData;
    })
    .catch((e) => {
      error.value = e;
    })
    .finally(() => {
      isLoading.value = false;
    });
  return {
    isLoading,
    data,
    error,
  };
}
