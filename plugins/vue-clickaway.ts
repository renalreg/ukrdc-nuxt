/*
Based on VinceG/vue-click-away

MIT License

Copyright (c) 2020 Vincent Gabriel <vadimg88@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import Vue, { VNode } from 'vue'
import { DirectiveBinding } from 'vue/types/options'

const clickEventType = document.ontouchstart !== null ? 'click' : 'touchstart'

interface ClickAwayElement extends HTMLElement {
  // eslint-disable-next-line camelcase
  __vue_click_away__?: (event: Event) => void
}

const onMounted = (el: ClickAwayElement, binding: DirectiveBinding, vnode: VNode) => {
  // Remove any existing clickaway callbacks
  onUnmounted(el)

  const vm = vnode.context
  const callback = binding.value

  let nextTick = false
  setTimeout(function () {
    nextTick = true
  }, 0)

  el.__vue_click_away__ = (event: Event) => {
    if ((!el || !el.contains(event.target as Node)) && callback && nextTick && typeof callback === 'function') {
      return callback.call(vm, event)
    }
  }

  document.addEventListener(clickEventType, el.__vue_click_away__, false)
}

const onUnmounted = (el: ClickAwayElement) => {
  if (el.__vue_click_away__) {
    document.removeEventListener(clickEventType, el.__vue_click_away__, false)
    delete el.__vue_click_away__
  }
}

const onUpdated = (el: ClickAwayElement, binding: DirectiveBinding, vnode: VNode) => {
  if (binding.value === binding.oldValue) {
    return
  }
  onMounted(el, binding, vnode)
}

const directive = {
  inserted: onMounted,
  componentUpdated: onUpdated,
  unbind: onUnmounted,
  // Vue 3:
  // mounted: onMounted,
  // updated: onUpdated,
  // unmounted: onUnmounted,
}

Vue.directive('click-away', directive)
