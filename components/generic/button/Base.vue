<template>
  <button
    type="button"
    class="
      py-2
      px-4
      rounded-md
      shadow-sm
      text-sm
      font-medium
      focus:outline-none
      focus:ring-2 focus:ring-offset-2
    "
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>
