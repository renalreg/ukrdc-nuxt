<template>
  <div class="flex items-center gap-3" :class="rightToLeft ? 'flex-row-reverse' : 'flex-row'">
    <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->
    <button
      type="button"
      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      :class="{ 'bg-green-400': value }"
      aria-pressed="false"
      aria-labelledby="toggle-label"
      @click="toggle()"
    >
      <span class="sr-only">Use setting</span>
      <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
      <span
        aria-hidden="true"
        class="pointer-events-none inline-block h-5 w-5 translate-x-0 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        :class="{ 'translate-x-5': value }"
      ></span>
    </button>
    <span v-if="label" id="toggle-label">
      <span class="font-medium text-gray-900">{{ label }} </span>
    </span>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    label: {
      type: String,
      required: false,
      default: null,
    },
    value: {
      type: Boolean,
      required: true,
    },
    rightToLeft: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, { emit }) {
    function toggle() {
      emit("input", !props.value);
    }

    return { toggle };
  },
});
</script>
