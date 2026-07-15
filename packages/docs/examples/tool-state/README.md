# Tool-state migration example

This example keeps tool-specific modes, actions and reducers outside the library core. The migration replaces `useContext(state)` with a store context and `useSelector` subscriptions.

```ts
import { createAction, createStore, createStoreContext } from '@kamod-ch/state'

export type PageMeta = { page: number; total?: number; pageSize: number }
export type ApiError = { message: string }
export type ListState<Item extends { id: string }> = {
  mode: 'list'
  status: 'idle' | 'loading' | 'success' | 'error'
  data: Item[]
  meta: PageMeta
  allDataLoaded: boolean
  error: ApiError | null
  active: string | null
}
export type EditState<Item> = { mode: 'edit'; status: 'idle' | 'loading' | 'success' | 'error'; data: Item; error: ApiError | null }
export type ToolState<Item extends { id: string }> = ListState<Item> | EditState<Item>

export const loadApiStart = createAction('tool/loadStart')
export const loadApiError = createAction<ApiError>('tool/loadError')
export const removeItem = createAction<string>('tool/removeItem')

export const ToolStateContext = createStoreContext<ToolState<{ id: string }>, ToolAction<{ id: string }>>({ name: 'ToolState' })

type ToolAction<Item extends { id: string }> =
  | ReturnType<typeof loadApiStart>
  | ReturnType<typeof loadApiError>
  | ReturnType<typeof removeItem>

export function createInitialListState<Item extends { id: string }>(): ListState<Item> {
  return { mode: 'list', status: 'idle', data: [], meta: { page: 1, pageSize: 25 }, allDataLoaded: false, error: null, active: null }
}

export function toolReducer<Item extends { id: string }>(state: ToolState<Item> = createInitialListState<Item>(), action: ToolAction<Item>): ToolState<Item> {
  if (loadApiStart.match(action)) return { ...state, status: 'loading', error: null }
  if (loadApiError.match(action)) return { ...state, status: 'error', error: action.payload }
  if (removeItem.match(action) && state.mode === 'list') {
    const nextData = state.data.filter((item) => item.id !== action.payload)
    return nextData === state.data ? state : { ...state, data: nextData, meta: { ...state.meta, total: state.meta.total === undefined ? undefined : Math.max(0, state.meta.total - (state.data.length - nextData.length)) } }
  }
  return state
}

const store = createStore({ reducer: toolReducer })
```

Global API errors live in `error`; form field errors should stay with Formisch. Server cache and refetch orchestration belong to TanStack Query.
