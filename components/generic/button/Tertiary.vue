<template>
  <genericButtonBase
    type="button"
    class="border border-gray-300 shadow-sm"
    :class="`focus:ring-indigo-500`"
    @click="$emit('click')"
  >
    <slot />
  </genericButtonBase>
</template>
