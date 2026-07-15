import type { Action, Dispatch, Middleware } from "../core/types";

export type LoggerOptions<S, A extends Action> = {
  enabled?: boolean;
  includeState?: boolean;
  redactAction?: (action: A) => unknown;
  redactState?: (state: S) => unknown;
  log?: (entry: LoggerEntry) => void;
  now?: () => number;
};
export type LoggerEntry = { type: string; durationMs: number; action?: unknown; previousState?: unknown; nextState?: unknown };

export function logger<S, A extends Action>(options: LoggerOptions<S, A> = {}): Middleware<S, A> {
  const enabled = options.enabled ?? process.env.NODE_ENV !== "production";
  return (api) => (next) => (action) => {
    if (!enabled) return next(action);
    const now = options.now ?? (() => performance.now());
    const start = now();
    const previous = options.includeState ? api.getState() : undefined;
    const result = next(action);
    const durationMs = now() - start;
    const entry: LoggerEntry = { type: action.type, durationMs };
    if (options.includeState) {
      entry.action = options.redactAction ? options.redactAction(action) : { type: action.type };
      entry.previousState = options.redactState ? options.redactState(previous as S) : "[redacted]";
      entry.nextState = options.redactState ? options.redactState(api.getState()) : "[redacted]";
    }
    (options.log ?? console.debug)(entry);
    return result;
  };
}

export type ThunkContext<S, A extends Action, E = unknown> = { dispatch: Dispatch<A>; getState(): S; signal?: AbortSignal; extraArgument?: E };
export type Thunk<S, A extends Action, E = unknown, R = unknown> = (context: ThunkContext<S, A, E>) => R;
export type ThunkOptions<E> = { signal?: AbortSignal; extraArgument?: E };

export function thunk<S, A extends Action, E = unknown>(options: ThunkOptions<E> = {}): Middleware<S, A> {
  return (api) => (next) => (action) => {
    if (typeof action === "function") {
      const context: ThunkContext<S, A, E> = { dispatch: api.dispatch, getState: api.getState };
      if (options.signal) context.signal = options.signal;
      if (options.extraArgument !== undefined) context.extraArgument = options.extraArgument;
      return (action as unknown as Thunk<S, A, E, A>)(context);
    }
    return next(action);
  };
}

export function createThunk<S, A extends Action, E = unknown, R = unknown>(fn: Thunk<S, A, E, R>): Thunk<S, A, E, R> {
  return fn;
}
