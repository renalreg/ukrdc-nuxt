<!--
Pill/breadcrumb-styled checkbox component, able to v-model onto either a single boolean value,
or an array of values when multiple instances are v-model'd onto the same array.
-->

<template>
  <label class="wrapper flex items-center font-medium text-gray-500">
    <input
      v-model="proxyChecked"
      class="peer sr-only"
      :class="{ 'checkpill-disabled': disabled }"
      type="checkbox"
      :disabled="disabled"
      :value="value"
    />
    <div :class="['peer', `checkpill-${colour}`]">
      {{ label }}
    </div>
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
    colour: {
      type: String,
      required: false,
      default: "white",
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

<style lang="postcss">
.checkpill-disabled {
  @apply cursor-default opacity-50;
}

.checkpill-white {
  @apply checkpill-base border-gray-500 text-gray-700 focus:ring-indigo-500 peer-checked:border-transparent peer-checked:bg-gray-500 peer-checked:text-white peer-checked:peer-hover:bg-gray-700 peer-focus:ring-indigo-500;
}
.checkpill-indigo {
  @apply checkpill-base border-indigo-500 text-indigo-700 focus:ring-indigo-500 peer-checked:border-transparent peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:peer-hover:bg-indigo-700 peer-focus:ring-indigo-500;
}
.checkpill-blue {
  @apply checkpill-base border-blue-500 text-blue-700 focus:ring-blue-500 peer-checked:border-transparent peer-checked:bg-blue-600 peer-checked:text-white peer-checked:peer-hover:bg-blue-700 peer-focus:ring-blue-500;
}
.checkpill-purple {
  @apply checkpill-base border-purple-500 text-purple-700 focus:ring-purple-500 peer-checked:border-transparent peer-checked:bg-purple-600 peer-checked:text-white peer-checked:peer-hover:bg-purple-700 peer-focus:ring-purple-500;
}
.checkpill-green {
  @apply checkpill-base border-green-500 text-green-700 focus:ring-green-500 peer-checked:border-transparent peer-checked:bg-green-600 peer-checked:text-white peer-checked:peer-hover:bg-green-700 peer-focus:ring-green-500;
}
.checkpill-yellow {
  @apply checkpill-base border-yellow-500 text-yellow-700 focus:ring-yellow-500 peer-checked:border-transparent peer-checked:bg-yellow-600 peer-checked:text-white peer-checked:peer-hover:bg-yellow-700 peer-focus:ring-yellow-500;
}
.checkpill-red {
  @apply checkpill-base border-red-500 text-red-700 focus:ring-red-500 peer-checked:border-transparent peer-checked:bg-red-600 peer-checked:text-white peer-checked:peer-hover:bg-red-700 peer-focus:ring-red-500;
}

.checkpill-base {
  @apply cursor-pointer rounded-full border bg-white px-2 py-1 font-medium shadow-sm peer-hover:bg-gray-50;
}
</style>
