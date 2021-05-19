<template>
  <button
    type="button"
    class="
      inline-flex
      items-center
      px-2
      py-0.5
      border border-gray-300
      shadow-sm
      text-xs
      font-medium
      rounded-sm
      text-gray-700
      bg-white
      hover:bg-gray-50
      focus:outline-none
      focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
    "
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script>
export default {}
</script>
