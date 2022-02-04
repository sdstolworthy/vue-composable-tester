# Vue Composable Function Tester

Vue Composable Function Tester simplifies testing Composable Functions in Vue 3.

## Installation

`npm install --save-dev vue-composable-function-tester`
`yarn add --dev vue-compatible-function-tester`

## Usage

Vue Composable Function Tester is intended to make unit testing Vue Composable Functions
(analogous to React Hooks) straightforward.

To use the tester, simply call `mountComposableFunction` with a callback that returns your composable function.
Under the hood, the tester will mount the composable into a Vue component, and return a reference
to the reactive values. In addition, the tester returns a `nextTick` method that allows you to make assertions after the state has updated.

Credit should be given to ktsn, the author of [Vue Composable Tester](https://github.com/ktsn/vue-composable-tester) for his work on a similar solution.

[From a common example on the web](https://vueschool.io/articles/vuejs-tutorials/what-is-a-vue-js-composable/)
```typescript
test("updates after invoking a setter method", async () => {
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
```

Using a promise:
```typescript
export function useAsynchronousLoader<T>(promiseCreator: () => Promise<T>) {
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

it("Reacts to a resolving promise", async () => {
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
```
