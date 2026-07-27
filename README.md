<p align="center">
  <img src=".github/assets/logo-kamod-state-dark.svg#gh-light-mode-only" alt="Kamod State" width="280" />
  <img src=".github/assets/logo-kamod-state-light.svg#gh-dark-mode-only" alt="Kamod State" width="280" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@kamod-ch/state"><img src="https://img.shields.io/npm/v/%40kamod-ch%2Fstate" alt="npm version" /></a>
  <a href="https://github.com/kamod-ch/kamod-state/stargazers"><img src="https://img.shields.io/github/stars/kamod-ch/kamod-state?style=social" alt="GitHub stars" /></a>
  <a href="https://github.com/kamod-ch/kamod-state/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license" /></a>
</p>

<p align="center">
  <strong><a href="https://www.npmjs.com/package/@kamod-ch/state">npm</a></strong> ·
  <strong><a href="https://github.com/kamod-ch/kamod-state">GitHub</a></strong> ·
  <strong><a href="https://github.com/kamod-ch/kamod-state/issues">Issues</a></strong>
</p>

> If Kamod State saves you time, **[star the repo](https://github.com/kamod-ch/kamod-state)** — it helps others discover the project.

# Kamod State

Tiny, typed reducer state management built for Preact.

```ts
import { createAction, createStore, createStoreContext } from '@kamod-ch/state'

const increment = createAction('counter/increment')
type State = { count: number }
type CounterAction = ReturnType<typeof increment>

const store = createStore<State, CounterAction>({
  reducer: (state = { count: 0 }, action) =>
    increment.match(action) ? { count: state.count + 1 } : state,
})

const CounterState = createStoreContext<State, CounterAction>({ name: 'CounterState' })
```

No React runtime dependency. Preact is a peer dependency for the Preact entry points.
