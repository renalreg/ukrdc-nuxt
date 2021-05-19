<template>
  <div class="flex items-center">
    <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->
    <button
      type="button"
      class="
        bg-gray-200
        relative
        inline-flex
        flex-shrink-0
        h-6
        w-11
        border-2 border-transparent
        rounded-full
        cursor-pointer
        transition-colors
        ease-in-out
        duration-200
        focus:outline-none
        focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
      "
      :class="{ 'bg-green-400': value }"
      aria-pressed="false"
      aria-labelledby="toggle-label"
      @click="toggle()"
    >
      <span class="sr-only">Use setting</span>
      <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
      <span
        aria-hidden="true"
        class="
          translate-x-0
          pointer-events-none
          inline-block
          h-5
          w-5
          rounded-full
          bg-white
          shadow
          transform
          ring-0
          transition
          ease-in-out
          duration-200
        "
        :class="{ 'translate-x-5': value }"
      ></span>
    </button>
    <span v-if="label" id="toggle-label" class="ml-3">
      <span class="text-sm font-medium text-gray-900">{{ label }} </span>
    </span>
  </div>
</template>

<script>
export default {
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
  },
  methods: {
    toggle() {
      this.$emit('input', !this.value)
    },
  },
}
</script>
