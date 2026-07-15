import type { Action, CreateStoreOptions, Dispatch, Listener, Reducer, Store } from "./types";

const INIT_TYPE = "@@kamod/state/INIT";

function assertAction(action: Action): void {
  if (typeof action !== "object" || action === null) throw new TypeError("Actions must be objects.");
  if (typeof action.type !== "string" || action.type.length === 0) {
    throw new TypeError("Actions must have a non-empty string type.");
  }
}

export function createStore<S, A extends Action>({ reducer, preloadedState, middleware = [] }: CreateStoreOptions<S, A>): Store<S, A> {
  let currentReducer = reducer;
  let currentState = preloadedState ?? currentReducer(undefined, { type: INIT_TYPE } as A);
  let listeners: Listener[] = [];
  let nextListeners = listeners;
  let isDispatching = false;
  let isDestroyed = false;
  let dispatch: Dispatch<A>;

  const ensureCanMutateNextListeners = () => {
    if (nextListeners === listeners) nextListeners = listeners.slice();
  };

  const baseDispatch: Dispatch<A> = (action) => {
    if (isDestroyed) throw new Error("Cannot dispatch after store.destroy().");
    assertAction(action);
    if (isDispatching) throw new Error("Reducers may not dispatch actions.");
    const previousState = currentState;
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    if (!Object.is(previousState, currentState)) {
      listeners = nextListeners;
      const snapshot = listeners.slice();
      for (const listener of snapshot) listener();
    }
    return action;
  };

  const store: Store<S, A> = {
    getState: () => currentState,
    dispatch: (action) => dispatch(action),
    subscribe(listener) {
      if (isDestroyed) throw new Error("Cannot subscribe after store.destroy().");
      let subscribed = true;
      ensureCanMutateNextListeners();
      nextListeners.push(listener);
      return () => {
        if (!subscribed) return;
        subscribed = false;
        ensureCanMutateNextListeners();
        const index = nextListeners.indexOf(listener);
        if (index >= 0) nextListeners.splice(index, 1);
      };
    },
    replaceReducer(nextReducer) {
      if (isDestroyed) throw new Error("Cannot replace reducer after store.destroy().");
      currentReducer = nextReducer;
      store.dispatch({ type: INIT_TYPE } as A);
    },
    destroy() {
      if (isDestroyed) return;
      isDestroyed = true;
      listeners = [];
      nextListeners = [];
    }
  };

  const api = { getState: store.getState, dispatch: ((action: A) => dispatch(action)) as Dispatch<A> };
  dispatch = middleware.reduceRight<Dispatch<A>>((next, mw) => mw(api)(next), baseDispatch);
  return store;
}
