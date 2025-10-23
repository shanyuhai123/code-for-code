const internalObjectProto = {}

export const createInternalObject = (): any =>
  Object.create(internalObjectProto)

export const isInternalObject = (obj: object): boolean =>
  Object.getPrototypeOf(obj) === internalObjectProto
