[![Unit Tests](https://github.com/sdstolworthy/vue-composable-tester/actions/workflows/tests.yaml/badge.svg)](https://github.com/sdstolworthy/vue-composable-tester/actions/workflows/tests.yaml)

[![Publish Package to NPM](https://github.com/sdstolworthy/vue-composable-tester/actions/workflows/publish-to-npm.yaml/badge.svg)](https://github.com/sdstolworthy/vue-composable-tester/actions/workflows/publish-to-npm.yaml)

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

Here's an example of testing a simple counter composable [based on a popular Vue tutorial](https://vueschool.io/articles/vuejs-tutorials/what-is-a-vue-js-composable/)

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

Here is a simple example of testing a composable that updates state based on the resolution of a promise.

Notice that the `nextTick()` method is called for each tick of the state that is expected from the composable.

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

## Want to help?

If you think you can help make this package better, please open an issue or a pull request and start a conversation.

Do you have a novel example that you want to share? Open an issue so we can add it to the Readme!

