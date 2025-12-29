export type Prettify<T> = { [K in keyof T]: T[K] } & {}

export type LooseRequired<T> = { [P in keyof (T & Required<T>)]: T[P] }
