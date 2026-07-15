import { describe, expect, it, vi } from "vitest";
import { createStore, type Reducer, type Middleware } from "../src/index";
import { logger } from "../src/middleware";

type State = { value: number };
type Act = { type: "inc" };
const reducer: Reducer<State, Act> = (s = { value: 0 }, a) => a.type === "inc" ? { value: s.value + 1 } : s;

describe("middleware", () => {
  it("uses deterministic order and final dispatch", () => {
    const calls: string[] = [];
    const one: Middleware<State, Act> = (api) => (next) => (action) => { calls.push(`one:${api.getState().value}`); const r = next(action); calls.push(`one-after:${api.getState().value}`); return r; };
    const two: Middleware<State, Act> = () => (next) => (action) => { calls.push("two"); return next(action); };
    const store = createStore({ reducer, middleware: [one, two] });
    store.dispatch({ type: "inc" });
    expect(calls).toEqual(["one:0", "two", "one-after:1"]);
  });

  it("redacts logger by default and is production-toggleable", () => {
    const log = vi.fn();
    const store = createStore({ reducer, middleware: [logger<State, Act>({ enabled: true, log, now: () => 1 })] });
    store.dispatch({ type: "inc" });
    const entry = log.mock.calls[0]?.[0];
    expect(entry).toMatchObject({ type: "inc", durationMs: 0 });
    expect(entry.nextState).toBeUndefined();
  });
});
