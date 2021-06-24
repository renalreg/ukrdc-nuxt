/* 
Builds computed properties with get and set methods.
Get will read from the browser LocalStorage, and
set will write to the browser LocalStorage. 

When page is being server-side rendered, the defaultValue
will be used until the page is mounted, and LocalStorage
becomes available to the page.
*/

import { computed } from '@nuxtjs/composition-api'

export default function () {
  function JSONStorage(storageKey: string, defaultValue: any) {
    return computed({
      get: (): any => {
        if (!process.browser) {
          return defaultValue
        }
        const storedJSON = localStorage.getItem(storageKey)
        if (!storedJSON) {
          return defaultValue
        } else {
          return JSON.parse(storedJSON) || defaultValue
        }
      },
      set: (newValue: any) => {
        localStorage.setItem(storageKey, JSON.stringify(newValue))
      },
    })
  }

  return { JSONStorage }
}
