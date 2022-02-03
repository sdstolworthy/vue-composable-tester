import { h, nextTick as vueNextTick } from "vue";
import { mount } from "@vue/test-utils";

export interface ComposableTester<T> {
  data: T;
  nextTick: typeof vueNextTick;
}
export function mountComposableFunction<T>(
  composableFunctionCreator: () => T
): ComposableTester<T> {
  const Child = {
    setup() {
      const result = composableFunctionCreator();
      const wrapper = () => result;
      return { wrapper };
    },
    template: '<div />'
  };
  const wrapper = mount({
    render() {
      return h(Child, { ref: "child" });
    },
  });
  return {
    data: (wrapper.vm.$refs.child as any).wrapper(),
    nextTick: wrapper.vm.$nextTick,
  };
}
