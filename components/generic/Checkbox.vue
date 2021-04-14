<template>
  <label
    class="wrapper flex items-center font-medium text-gray-500 mr-4 text-sm"
  >
    <input
      v-model="proxyChecked"
      class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 mr-2 rounded"
      type="checkbox"
      :value="value"
    />
    {{ label }}
  </label>
</template>

<script>
export default {
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
  },
  computed: {
    proxyChecked: {
      get() {
        return this.checked
      },
      set(val) {
        this.$emit('change', val)
      },
    },
  },
}
</script>
