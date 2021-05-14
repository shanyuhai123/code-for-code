export function invokeWithErrorHandling (handler: Function, context: any, args: any[] | null, vm: any, info: string) {
  let res

  try {
    res = args ? handler.apply(context, args) : handler.call(context)
  } catch (e) {
    console.log(e)
  }

  return res
}
