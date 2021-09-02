<template>
  <span
    class="block px-4 py-2 text-sm"
    :class="classes"
    role="menuitem"
    :tabindex="disabled ? -1 : 0"
    @click="$emit('click')"
    @keydown.enter.prevent="$emit('click')"
  >
    <slot></slot>
  </span>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
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
      } else {
        return [
          'text-gray-700',
          'hover:bg-gray-100',
          'hover:text-gray-900',
          'focus:bg-indigo-100',
          'focus:text-gray-900',
          'cursor-pointer',
        ]
      }
    })

    return { classes }
  },
})
</script>
