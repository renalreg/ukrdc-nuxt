<template>
  <GenericMenu class="mt-8" :show="show">
    <div ref="automenuMenu" @keydown.up.prevent="" @keydown.down.prevent="">
      <GenericMenuItem
        v-for="(item, index) in items"
        :key="index + item.label"
        :index="index"
        :disabled="item.disabled"
        :selected="selectedIndex === index"
        @click.native="item.callback"
      >
        {{ item.label }}
      </GenericMenuItem>
    </div>
  </GenericMenu>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'

interface MenuAutoItem {
  label: String
  callback: () => void
  disabled: Boolean
}

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    items: {
      type: Array as () => MenuAutoItem[],
      required: true,
    },
  },
  setup(props) {
    const selectedIndex = ref(-1)
    const automenuMenu = ref<HTMLElement>()

    watch(
      () => props.show,
      (value) => {
        if (value) {
          automenuMenu.value?.focus()
        }
      }
    )

    return { selectedIndex, automenuMenu }
  },
})
</script>
