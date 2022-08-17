<template>
  <input
    ref="textBoxRef"
    class="block rounded-md border border-gray-300 bg-white py-2 placeholder-gray-500 focus:border-indigo-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
    :value="value"
    @input="$emit('input', $event.target.value)"
  />
</template>

<script lang="ts">
export default defineComponent({
  props: {
    value: {
      default: "",
      type: String,
    },
    focus: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const textBoxRef = ref<HTMLFormElement>();

    onMounted(() => {
      if (props.focus) {
        textBoxRef.value?.focus();
      }
    });

    return { textBoxRef };
  },
});
</script>
