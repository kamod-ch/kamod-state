import { cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import renderToString from "preact-render-to-string";
import { act } from "preact/test-utils";
import { createAction, createStore, createStoreContext, type Reducer } from "../src/index";

const inc = createAction("inc");
const setName = createAction<string, "setName">("setName");
type State = { count: number; name: string };
type Act = ReturnType<typeof inc> | ReturnType<typeof setName>;
const reducer: Reducer<State, Act> = (state = { count: 0, name: "a" }, action) => inc.match(action) ? { ...state, count: state.count + 1 } : setName.match(action) ? { ...state, name: action.payload } : state;
const Ctx = createStoreContext<State, Act>({ name: "TestState" });

afterEach(cleanup);

describe("preact integration", () => {
  it("throws outside provider", () => {
    function Bad() { Ctx.useStore(); return null; }
    expect(() => render(<Bad />)).toThrow(/TestState/);
  });

  it("dispatch updates UI", () => {
    const store = createStore({ reducer });
    function Counter() {
      const count = Ctx.useSelector((s) => s.count);
      const dispatch = Ctx.useDispatch();
      return <button onClick={() => dispatch(inc())}>{count}</button>;
    }
    render(<Ctx.Provider store={store}><Counter /></Ctx.Provider>);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button").textContent).toBe("1");
  });

  it("does not rerender for unselected state", () => {
    const store = createStore({ reducer });
    const renders = vi.fn();
    function Counter() { renders(); return <span>{Ctx.useSelector((s) => s.count)}</span>; }
    render(<Ctx.Provider store={store}><Counter /></Ctx.Provider>);
    act(() => { store.dispatch(setName("b")); });
    expect(renders).toHaveBeenCalledTimes(1);
    act(() => { store.dispatch(inc()); });
    expect(renders).toHaveBeenCalledTimes(2);
  });

  it("supports custom equality and store switch", () => {
    const a = createStore({ reducer, preloadedState: { count: 0, name: "a" } });
    const b = createStore({ reducer, preloadedState: { count: 5, name: "b" } });
    function Label() { return <span>{Ctx.useSelector((s) => ({ name: s.name }), (x, y) => x.name === y.name).name}</span>; }
    const view = render(<Ctx.Provider store={a}><Label /></Ctx.Provider>);
    expect(screen.getByText("a")).toBeTruthy();
    view.rerender(<Ctx.Provider store={b}><Label /></Ctx.Provider>);
    expect(screen.getByText("b")).toBeTruthy();
  });

  it("renders on server", () => {
    const store = createStore({ reducer });
    function Counter() { return <span>{Ctx.useSelector((s) => s.count)}</span>; }
    expect(renderToString(<Ctx.Provider store={store}><Counter /></Ctx.Provider>)).toContain("0");
  });
});
