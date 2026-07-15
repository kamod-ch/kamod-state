import type { Action, Reducer, StateFromReducersMapObject } from "./types";

type ReducerMap = Record<string, (state: never, action: never) => unknown>;
type ActionFromMap<M> = {
  [K in keyof M]: M[K] extends Reducer<infer _S, infer A> ? A : never;
}[keyof M] & Action;

export function combineReducers<M extends ReducerMap>(reducers: M): Reducer<StateFromReducersMapObject<M>, ActionFromMap<M>> {
  const keys = Object.keys(reducers) as Array<keyof M>;
  for (const key of keys) {
    const reducer = reducers[key] as unknown as Reducer<unknown, Action>;
    const initial = reducer(undefined, { type: "@@kamod/state/PROBE" });
    if (initial === undefined) {
      throw new Error(`Reducer for key "${String(key)}" returned undefined during initialization.`);
    }
  }

  return (state, action) => {
    let changed = false;
    const previous = state as Record<string, unknown> | undefined;
    const nextState: Record<string, unknown> = {};

    if (previous) {
      for (const key of Object.keys(previous)) {
        if (!Object.prototype.hasOwnProperty.call(reducers, key)) changed = true;
      }
    }

    for (const key of keys) {
      const reducer = reducers[key] as unknown as Reducer<unknown, Action>;
      const previousSlice = previous?.[key as string];
      const nextSlice = reducer(previousSlice, action);
      if (nextSlice === undefined) {
        throw new Error(`Reducer for key "${String(key)}" returned undefined for action "${action.type}".`);
      }
      nextState[key as string] = nextSlice;
      changed ||= !Object.is(nextSlice, previousSlice);
    }

    if (!changed && previous) return previous as StateFromReducersMapObject<M>;
    return nextState as StateFromReducersMapObject<M>;
  };
}
