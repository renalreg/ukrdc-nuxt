<template>
  <Menu
    label="Button"
    :options="[
      { label: 'foo', callback: selectCallback },
      { label: 'bar', callback: selectCallback },
    ]"
  ></Menu>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    function selectCallback(label: string) {
      console.log(label)
    }

    return { selectCallback }
  },
})
</script>
