import { describe, expect, expectTypeOf, it, vi } from "vitest";
import { combineReducers, createAction, createStore, type Action, type Reducer, type StateFromReducersMapObject } from "../src/index";

const inc = createAction("inc");
const add = createAction<number, "add">("add");
type CounterAction = ReturnType<typeof inc> | ReturnType<typeof add> | Action<"noop">;
const reducer: Reducer<number, CounterAction> = (state = 0, action) => inc.match(action) ? state + 1 : add.match(action) ? state + action.payload : state;

describe("core", () => {
  it("initializes and dispatches", () => {
    const store = createStore({ reducer });
    expect(store.getState()).toBe(0);
    const listener = vi.fn();
    store.subscribe(listener);
    store.dispatch(inc());
    expect(store.getState()).toBe(1);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("uses preloaded state and skips no-op notifications", () => {
    const store = createStore({ reducer, preloadedState: 5 });
    const listener = vi.fn();
    store.subscribe(listener);
    store.dispatch({ type: "noop" });
    expect(store.getState()).toBe(5);
    expect(listener).not.toHaveBeenCalled();
  });

  it("rejects invalid and nested dispatch", () => {
    const nested = vi.fn();
    const store = createStore<number, CounterAction>({ reducer: (state = 0, action) => { if (inc.match(action)) nested(); return state; } });
    nested.mockImplementation(() => store.dispatch(inc()));
    expect(() => store.dispatch({ type: "" } as unknown as CounterAction)).toThrow(/non-empty/);
    expect(() => store.dispatch(inc())).toThrow(/Reducers may not dispatch/);
  });

  it("handles unsubscribe and subscribe during notification safely", () => {
    const store = createStore({ reducer });
    const second = vi.fn();
    const first = vi.fn(() => { unsub(); store.subscribe(second); });
    const unsub = store.subscribe(first);
    store.dispatch(inc());
    store.dispatch(inc());
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    unsub();
  });

  it("propagates reducer and listener errors", () => {
    const boom = new Error("boom");
    const store = createStore<number, CounterAction>({ reducer: (state = 0, action) => { if (inc.match(action)) throw boom; return state; } });
    expect(() => store.dispatch(inc())).toThrow(boom);
    const listenerStore = createStore({ reducer });
    listenerStore.subscribe(() => { throw boom; });
    expect(() => listenerStore.dispatch(inc())).toThrow(boom);
  });

  it("destroys", () => {
    const store = createStore({ reducer });
    store.destroy();
    expect(store.getState()).toBe(0);
    expect(() => store.subscribe(() => {})).toThrow(/destroy/);
    expect(() => store.dispatch(inc())).toThrow(/destroy/);
  });

  it("combines reducers with stable references", () => {
    const label = (state = "x", _action: CounterAction) => state;
    const root = combineReducers({ count: reducer, label });
    type Root = StateFromReducersMapObject<{ count: typeof reducer; label: typeof label }>;
    expectTypeOf<Root>().toEqualTypeOf<{ count: number; label: string }>();
    const s1 = root(undefined, { type: "noop" });
    const s2 = root(s1, { type: "noop" });
    expect(s2).toBe(s1);
    const s3 = root(s1, inc());
    expect(s3).not.toBe(s1);
    expect(s3.label).toBe(s1.label);
  });

  it("creates action creators", () => {
    expect(inc()).toEqual({ type: "inc" });
    expect(add(2)).toEqual({ type: "add", payload: 2 });
    expect(add.type).toBe("add");
    const action: CounterAction = add(1);
    if (add.match(action)) expectTypeOf(action.payload).toEqualTypeOf<number>();
  });
});
