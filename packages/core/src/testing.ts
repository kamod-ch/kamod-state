import { createStore } from "./core/createStore";
import type { Action, CreateStoreOptions, Store } from "./core/types";

export function createTestStore<S, A extends Action>(options: CreateStoreOptions<S, A>): Store<S, A> {
  return createStore(options);
}

export function observeActions<S, A extends Action>(store: Store<S, A>) {
  const actions: A[] = [];
  const originalDispatch = store.dispatch;
  store.dispatch = ((action: A) => {
    actions.push(action);
    return originalDispatch(action);
  }) as Store<S, A>["dispatch"];
  return { actions, dispose: () => { store.dispatch = originalDispatch; } };
}

export function recordActions<A extends Action>() {
  const actions: A[] = [];
  return { actions, middleware: () => (next: (action: A) => A) => (action: A) => { actions.push(action); return next(action); } };
}
