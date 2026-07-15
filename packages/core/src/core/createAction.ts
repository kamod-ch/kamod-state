import type { Action, PayloadAction } from "./types";

type UnknownAction = Action<string> & Readonly<Record<string, unknown>>;
export type ActionCreatorWithoutPayload<TType extends string> = (() => Action<TType>) & {
  readonly type: TType;
  match(action: UnknownAction): action is Action<TType>;
};
export type ActionCreatorWithPayload<TPayload, TType extends string> = ((payload: TPayload) => PayloadAction<TPayload, TType>) & {
  readonly type: TType;
  match(action: UnknownAction): action is PayloadAction<TPayload, TType>;
};
export type PreparedAction<TPayload> = { payload: TPayload } & Readonly<Record<string, unknown>>;
export type PrepareAction<TArg, TPayload> = (arg: TArg) => PreparedAction<TPayload>;

export function createAction<TType extends string>(type: TType): ActionCreatorWithoutPayload<TType>;
export function createAction<TPayload, TType extends string = string>(type: TType): ActionCreatorWithPayload<TPayload, TType>;
export function createAction<TArg, TPayload, TType extends string = string>(type: TType, prepare: PrepareAction<TArg, TPayload>): ActionCreatorWithPayload<TArg, TType>;
export function createAction(type: string, prepare?: (arg: unknown) => PreparedAction<unknown>) {
  const creator = function (payload?: unknown) {
    return prepare ? { type, ...prepare(payload) } : arguments.length === 0 ? { type } : { type, payload };
  };
  Object.defineProperty(creator, "type", { value: type, enumerable: true });
  Object.defineProperty(creator, "match", { value: (action: UnknownAction) => action.type === type, enumerable: true });
  return creator;
}
