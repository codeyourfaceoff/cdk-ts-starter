export type AnyFunction = (...args: any[]) => any

// Tail<T> returns a tuple with the first element removed
// so Tail<[1, 2, 3]> is [2, 3]
// (works by using rest tuples)
export type Tail<T extends any[]> = ((...t: T) => void) extends (
  h: any,
  ...r: infer R
) => void
  ? R
  : never

// Last<T> returns the last element of the tuple
// (works by finding the one property key in T which is not in Tail<T>)
export type Last<T extends any[]> = T[Exclude<keyof T, keyof Tail<T>>]
export type LastParameter<F extends (...args: any) => any> = Last<Parameters<F>>
