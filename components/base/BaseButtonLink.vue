<template>
  <p class="cursor-pointer text-indigo-600 hover:text-indigo-500" @click="$emit('click')">
    <slot />
  </p>
</template>
