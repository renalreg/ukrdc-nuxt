<template>
  <p class="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500" @click="$emit('click')">
    <slot />
  </p>
</template>
