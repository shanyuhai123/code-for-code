export function patchDOMProp(
  el: any,
  key: string,
  value: any,
) {
  let needRemove = false
  const type = typeof el[key]

  if (type === 'boolean') {
    if (value === false) {
      needRemove = true
    }
  }

  try {
    el[key] = value
  }
  catch {
    // TODO
  }

  needRemove && el.removeAttribute(key)
}
