<template>
  <p class="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer" @click="$emit('click')">
    <slot />
  </p>
</template>
