export function removeElement(el: HTMLElement) {
  if (typeof el.remove !== 'undefined') el.remove()
  else el.parentNode?.removeChild(el)
}

// add the component w/ the specified props
export function spawn(id: string, propsData: object, component: any, Vue: any) {
  const Instance = Vue.extend(component)
  return new Instance({
    el: document.getElementById(id)?.appendChild(document.createElement('div')),
    propsData,
  })
}
