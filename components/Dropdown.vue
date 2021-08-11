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
          Button

          <div class="float-right pointer-events-none">
            <!-- Heroicon name: solid/selector -->
            <svg
              class="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
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
            :key="option"
            class="px-3 py-2 cursor-pointer rounded"
            :class="[i === highlightedIndex ? 'bg-indigo-50' : 'hover:bg-grey-darker']"
            @click="select(i)"
          >
            {{ labels && labels.length === options.length ? `${option} (${labelFor(option)})` : option }}
          </li>
        </ul>
        <div v-show="options.length === 0" class="px-3 py-2 text-grey">No results found for "{{ search }}"</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: false,
      default: null,
    },
    options: {
      type: Array,
      required: true,
    },
    labels: {
      type: Array,
      required: false,
      default: null,
    },
    hint: {
      type: String,
      required: false,
      default: 'Select an item...',
    },
    mountOpened: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      isOpen: false,
      highlightedIndex: 0,
    }
  },

  mounted() {
    if (this.mountOpened) {
      this.open()
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
      this.$emit('input', this.options[this.highlightedIndex])
      this.close()
    },
    select(index) {
      this.highlightedIndex = index
      this.commitSelection()
    },
    clear() {
      this.highlightedIndex = 0
      this.$emit('input', null)
      this.close()
    },
    highlight(index) {
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
    labelFor(value) {
      if (this.labels) {
        const index = this.options.indexOf(value)
        if (index) {
          return this.labels[index]
        }
      }
      return value
    },
  },
}
</script>
