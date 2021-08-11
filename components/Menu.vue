<template>
  <transition :duration="200">
    <div class="relative">
      <!-- Background overlay, show/hide based on modal state. -->
      <div v-if="isOpen" class="fixed inset-0" aria-hidden="true" @click="cancel()">
        <div class="absolute inset-0 opacity-0"></div>
      </div>

      <!-- Main component -->
      <div class="flex">
        <button
          class="flex items-center truncate border px-3 py-2 shadow-sm sm: border-gray-300 rounded-md"
          tabindex="0"
          @click="open"
          @keydown.up="highlightPrev"
          @keydown.down="highlightNext"
          @keydown.enter.prevent="commitSelection"
          @keydown.esc="cancel"
        >
          <span v-if="label" class="mr-2">{{ label }}</span>

          <div class="float-right pointer-events-none">
            <!-- Heroicon name: solid/chevron-down -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </button>
      </div>

      <!-- Popover -->

      <div
        v-show="isOpen"
        class="absolute bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 pin-x px-2 pt-2 z-50"
      >
        <ul
          v-show="options.length > 0"
          ref="options"
          class="list-reset relative overflow-y-scroll py-2"
          style="max-height: 200px"
        >
          <li
            v-for="(option, i) in options"
            ref="option"
            :key="option.label"
            class="px-3 py-2 cursor-pointer rounded"
            :class="[i === highlightedIndex ? 'bg-indigo-50' : 'hover:bg-grey-darker']"
            @click="select(i)"
          >
            {{ option.label }}
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
interface MenuItem {
  label: string
  callback: (label: string) => void
}

export default {
  props: {
    label: {
      required: false,
      type: String,
      default: undefined,
    },
    options: {
      type: Array as () => MenuItem[],
      required: true,
    },
  },

  data() {
    return {
      isOpen: false,
      highlightedIndex: 0,
    }
  },

  methods: {
    open() {
      this.isOpen = true
    },
    close() {
      this.isOpen = false
    },
    cancel() {
      this.close()
    },
    commitSelection() {
      this.close()
      this.options[this.highlightedIndex].callback(this.options[this.highlightedIndex].label)
    },
    select(index: number) {
      this.highlightedIndex = index
      this.commitSelection()
    },
    clear() {
      this.highlightedIndex = 0
      this.$emit('input', null)
      this.close()
    },
    highlight(index: number) {
      this.open()
      this.highlightedIndex = index
      this.$nextTick(() => {
        this.$refs.option[index].scrollIntoView({ block: 'nearest' })
      })
    },
    highlightPrev() {
      this.highlight(this.highlightedIndex - 1 < 0 ? this.options.length - 1 : this.highlightedIndex - 1)
    },
    highlightNext() {
      this.highlight(this.highlightedIndex + 1 >= this.options.length ? 0 : this.highlightedIndex + 1)
    },
  },
}
</script>
