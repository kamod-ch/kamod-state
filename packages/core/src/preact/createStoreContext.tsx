import { createContext, type ComponentChildren } from "preact";
import { useCallback, useContext, useRef } from "preact/hooks";
import { useSyncExternalStore } from "preact/compat";
import type { Action, Dispatch, EqualityFn, Store } from "../core/types";

type StoreContextValue<S, A extends Action> = Store<S, A> | undefined;
export type StoreContextOptions = { name?: string };
export type StoreProviderProps<S, A extends Action> = { store: Store<S, A>; children?: ComponentChildren };

const objectIs = Object.is;

export function createStoreContext<S, A extends Action = Action>(options: StoreContextOptions = {}) {
  const name = options.name ?? "KamodState";
  const Context = createContext<StoreContextValue<S, A>>(undefined);
  Context.displayName = `${name}Context`;

  function Provider({ store, children }: StoreProviderProps<S, A>) {
    return <Context.Provider value={store}>{children}</Context.Provider>;
  }

  function useStore(): Store<S, A> {
    const store = useContext(Context);
    if (!store) throw new Error(`${name}: useStore must be used inside ${name}.Provider.`);
    return store;
  }

  function useDispatch(): Dispatch<A> {
    return useStore().dispatch;
  }

  function useSelector<TSelected>(selector: (state: S) => TSelected, equalityFn: EqualityFn<TSelected> = objectIs): TSelected {
    const store = useStore();
    const selectorRef = useRef(selector);
    const equalityRef = useRef(equalityFn);
    const lastRef = useRef<{ state: S; selected: TSelected }>();
    selectorRef.current = selector;
    equalityRef.current = equalityFn;

    const getSelectedSnapshot = useCallback(() => {
      const state = store.getState();
      const previous = lastRef.current;
      if (previous && Object.is(previous.state, state)) return previous.selected;
      const selected = selectorRef.current(state);
      if (previous && equalityRef.current(previous.selected, selected)) {
        lastRef.current = { state, selected: previous.selected };
        return previous.selected;
      }
      lastRef.current = { state, selected };
      return selected;
    }, [store]);
    const subscribe = useCallback((notify: () => void) => store.subscribe(notify), [store]);
    return useSyncExternalStore(subscribe, getSelectedSnapshot);
  }

  return { Context, Provider, useStore, useDispatch, useSelector };
}
