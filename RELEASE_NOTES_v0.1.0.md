# Release notes: v0.1.0

`@kamod-ch/state` starts as a tiny, typed reducer state management library built for Preact.

## Public API

- `createStore`
- `combineReducers`
- `createAction`
- `createStoreContext`
- `logger` via `@kamod-ch/state/middleware`
- testing helpers via `@kamod-ch/state/testing`
- experimental `toSignal` via `@kamod-ch/state/signals`

## Compatibility

- ESM-first
- Node >= 20.11
- TypeScript >= 5.7
- Preact >= 10.19 as peer dependency for Preact APIs

## Notes

No React runtime dependency is included. Server-state caching remains a TanStack Query responsibility; form-state remains a Formisch responsibility.
