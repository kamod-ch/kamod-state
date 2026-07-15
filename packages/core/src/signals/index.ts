import { signal, type ReadonlySignal } from "@preact/signals";
import type { Action, EqualityFn, Store } from "../core/types";

export type StoreSignal<T> = ReadonlySignal<T> & { dispose(): void };

export function toSignal<S, A extends Action, T>(store: Store<S, A>, selector: (state: S) => T, equalityFn: EqualityFn<T> = Object.is): StoreSignal<T> {
  const selected = signal(selector(store.getState()));
  const unsubscribe = store.subscribe(() => {
    const next = selector(store.getState());
    if (!equalityFn(selected.peek(), next)) selected.value = next;
  });
  return Object.assign(selected, { dispose: unsubscribe }) as StoreSignal<T>;
}
