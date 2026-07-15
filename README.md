# kamod-state

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
