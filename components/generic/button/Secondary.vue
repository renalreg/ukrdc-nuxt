<template>
  <genericButtonBase
    type="button"
    class="border border-transparent text-white"
    :class="`text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500`"
    @click="$emit('click')"
  >
    <slot />
  </genericButtonBase>
</template>
