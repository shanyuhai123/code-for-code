export function warn(msg: string, ...args: any[]): void {
  const warnArgs = [`[Vue warn]: ${msg}`, ...args]
  console.warn(...warnArgs)
}
