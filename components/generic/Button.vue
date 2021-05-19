<template>
  <genericButtonBase
    type="button"
    class="
      bg-white
      border border-gray-300
      text-gray-700
      hover:bg-gray-50
      focus:ring-indigo-500
    "
    @click="$emit('click')"
  >
    <slot />
  </genericButtonBase>
</template>

<script>
export default {}
</script>
