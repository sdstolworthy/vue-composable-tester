import { mountComposableFunction } from "../src";
import { useComposableFunction } from "./mockComposable";

describe("Vue Composable Function Tester", () => {
  it("Returns the composable function's return value in the data property", async () => {
    const promise = new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
    const composable = mountComposableFunction(() =>
      useComposableFunction(() => promise)
    );
    const comparisonType = useComposableFunction(() => promise);
    expect(Object.keys(composable.data)).toStrictEqual(
      Object.keys(comparisonType)
    );
  });
  it("reacts to changing state", async () => {
    const resolvedData = {
      hello: "world",
    };
    const promise = new Promise<typeof resolvedData>((resolve) =>
      setTimeout(() => resolve(resolvedData), 1000)
    );
    const composable = mountComposableFunction(() =>
      useComposableFunction(() => promise)
    );
    await composable.nextTick();
    expect(composable.data.isLoading.value).toBe(true);
    await promise;
    await composable.nextTick();
    expect(composable.data.data.value).toStrictEqual(resolvedData);
    await composable.nextTick();
    expect(composable.data.isLoading.value).toBe(false);
  });
});
