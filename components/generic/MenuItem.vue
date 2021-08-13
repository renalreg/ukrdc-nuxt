<template>
  <li class="block px-4 py-2 text-sm" :class="classes" role="menuitem" tabindex="-1">
    <slot></slot>
  </li>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    selected: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  setup(props) {
    const classes = computed(() => {
      if (props.disabled) {
        return ['text-gray-400']
      } else if (props.selected) {
        return ['bg-indigo-100', 'hover:bg-indigo-200', 'text-gray-900', 'cursor-pointer']
      } else {
        return ['text-gray-700', 'hover:bg-gray-100', 'hover:text-gray-900', 'cursor-pointer']
      }
    })

    return { classes }
  },
})
</script>
