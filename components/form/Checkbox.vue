<!--
Checkbox component, able to v-model onto either a single boolean value,
or an array of values when multiple instances are v-model'd onto the same array.
-->

<template>
  <label class="wrapper flex items-center font-medium text-gray-500">
    {{ rightToLeft ? label : "" }}
    <input
      v-model="proxyChecked"
      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      :class="{ 'opacity-50': disabled, 'mr-2': !rightToLeft, 'ml-2': rightToLeft }"
      type="checkbox"
      :disabled="disabled"
      :value="value"
    />
    {{ !rightToLeft ? label : "" }}
  </label>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  model: {
    prop: "checked",
    event: "change",
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
    rightToLeft: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, { emit }) {
    const proxyChecked = computed({
      get: () => props.checked,
      set: (value) => {
        emit("change", value);
      },
    });

    return { proxyChecked };
  },
});
</script>
