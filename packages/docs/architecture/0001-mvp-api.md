# ADR 0001: MVP API contract

## Status

Accepted for the MVP scaffold.

## Context

`@kamod-ch/state` is a small reducer/action based state library for Preact. It must not require React at runtime and the framework-independent store core must not import Preact.

## Decision

The public MVP API is:

- `createStore({ reducer, preloadedState?, middleware? })`
- `combineReducers(reducers)`
- `createAction(type, prepare?)`
- `createStoreContext({ name? })`
- `Provider`, `useStore`, `useDispatch`, `useSelector`

The Store exposes `getState`, `dispatch`, `subscribe`, `replaceReducer`, and `destroy`. `replaceReducer` exists for tests, lazy loaded reducers, and development tooling; applications should prefer a stable root reducer.

Preact Context carries only the stable store instance. Components subscribe with `useSelector`; default equality is `Object.is`.

## Non-goals

- React Redux compatibility layer
- form state management
- server cache, retry, refetch, mutation orchestration
- own signals engine
- mandatory dependency on `@preact/signals` or `@kamod-ch/signals`

## Listener errors

Listener errors are not swallowed. Notification stops at the throwing listener and the error propagates to the caller of `dispatch`.

## Destroy semantics

After `destroy`, `getState` remains available for the last snapshot. `dispatch`, `subscribe`, and `replaceReducer` throw.

## Unknown keys in `combineReducers`

Unknown root-state keys from a previous/preloaded state are omitted from the next combined state. This is intentional and documented instead of being silently preserved.
