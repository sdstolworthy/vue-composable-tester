import { readonly, ref } from "vue";
import { mountComposableFunction } from "../src";
import { useAsynchronousLoader } from "./mockComposable";

describe("Vue Composable Function Tester", () => {
  it("Returns the composable function's return value in the data property", async () => {
    const promise = new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
    const composable = mountComposableFunction(() =>
      useAsynchronousLoader(() => promise)
    );
    const comparisonType = useAsynchronousLoader(() => promise);
    expect(Object.keys(composable.data)).toStrictEqual(
      Object.keys(comparisonType)
    );
  });
  it("reacts to changing state", async () => {
    const resolvedData = {
      hello: "world",
    };
    const promise = Promise.resolve(resolvedData);
    const composable = mountComposableFunction(() =>
      useAsynchronousLoader(() => promise)
    );
    await composable.nextTick();
    expect(composable.data.isLoading.value).toBe(true);
    await promise;
    await composable.nextTick();
    expect(composable.data.data.value).toStrictEqual(resolvedData);
    await composable.nextTick();
    expect(composable.data.isLoading.value).toBe(false);
  });
  /**
   * Test a common example from this article
   * @see https://vueschool.io/articles/vuejs-tutorials/what-is-a-vue-js-composable/
   */
  it("updates after invoking a setter method", async () => {
    const useCount = () => {
      const count = ref(0);
      const increment = () => count.value++;

      return {
        count: readonly(count),
        increment,
      };
    };
    const { data, nextTick } = mountComposableFunction(() => useCount());
    expect(data.count.value).toBe(0);
    data.increment();
    await nextTick();
    expect(data.count.value).toBe(1);
  });
});
