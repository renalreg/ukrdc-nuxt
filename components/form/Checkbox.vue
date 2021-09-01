<template>
  <label class="wrapper flex items-center font-medium text-gray-500 mr-4">
    <input
      v-model="proxyChecked"
      class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 mr-2 rounded"
      :class="{ 'opacity-50': disabled }"
      type="checkbox"
      :disabled="disabled"
      :value="value"
    />
    {{ label }}
  </label>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    label: {
      type: String,
      required: false,
      default: null,
    },
    checked: {
      type: [Array, Boolean],
      default: false,
    },
    value: {
      type: [String, Number, Boolean],
      required: false,
      default: null,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, { emit }) {
    const proxyChecked = computed({
      get: () => props.checked,
      set: (value) => {
        emit('change', value)
      },
    })

    return { proxyChecked }
  },
})
</script>
