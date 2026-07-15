export type Action<TType extends string = string> = { readonly type: TType };
export type PayloadAction<TPayload, TType extends string = string> = Action<TType> & { readonly payload: TPayload };
export type AnyAction = Action<string> & Readonly<Record<string, unknown>>;
export type Reducer<S, A extends Action = AnyAction> = (state: S | undefined, action: A) => S;
export type ReducersMapObject = Record<string, (state: never, action: never) => unknown>;
export type StateFromReducersMapObject<M> = {
  [K in keyof M]: M[K] extends Reducer<infer S, infer _A> ? S : never;
};
export type ActionFromReducersMapObject<M> = {
  [K in keyof M]: M[K] extends Reducer<infer _S, infer A> ? A : never;
}[keyof M];
export type Dispatch<A extends Action = AnyAction> = (action: A) => A;
export type Listener = () => void;
export type Unsubscribe = () => void;
export type EqualityFn<T> = (left: T, right: T) => boolean;
export type MiddlewareAPI<S, A extends Action = AnyAction> = {
  getState(): S;
  dispatch: Dispatch<A>;
};
export type Middleware<S, A extends Action = AnyAction> = (api: MiddlewareAPI<S, A>) => (next: Dispatch<A>) => Dispatch<A>;
export type Store<S, A extends Action = AnyAction> = {
  getState(): S;
  dispatch: Dispatch<A>;
  subscribe(listener: Listener): Unsubscribe;
  replaceReducer(reducer: Reducer<S, A>): void;
  destroy(): void;
};
export type CreateStoreOptions<S, A extends Action = AnyAction> = {
  reducer: Reducer<S, A>;
  preloadedState?: S;
  middleware?: readonly Middleware<S, A>[];
};
