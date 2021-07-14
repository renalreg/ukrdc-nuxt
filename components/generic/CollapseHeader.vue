<template>
  <div>
    <div class="flex items-center cursor-pointer" @click="toggle()">
      <span>
        <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
      <TextL1>{{ label }}</TextL1>
    </div>
    <div v-show="isOpen"><slot></slot></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  model: {
    prop: 'open',
    event: 'change',
  },
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  setup() {
    const isOpen = ref(false)

    function toggle(): void {
      isOpen.value = !isOpen.value
    }

    return {
      isOpen,
      toggle,
    }
  },
})
</script>
