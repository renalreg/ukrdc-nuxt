<template>
  <transition :duration="200">
    <div class="relative">
      <!-- Background overlay, show/hide based on modal state. -->
      <transition
        enter-active-class="ease-out"
        enter-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in"
        leave-class="opacity-100"
        leave-to-class="opacity-0 scale-90"
      >
        <div
          v-if="isOpen"
          class="fixed inset-0 transition-opacity"
          aria-hidden="true"
          @click="cancel()"
        >
          <div class="absolute inset-0 bg-gray-500 opacity-10"></div>
        </div>
      </transition>

      <!-- Main component -->
      <div class="flex w-full">
        <div
          ref="input"
          class="block w-full border px-3 py-2 shadow-sm sm:text-sm border-gray-300 rounded-md"
          :class="{
            invisible: isOpen,
          }"
          tabindex="0"
          @click="open"
          @keydown.up.prevent="open"
          @keydown.down.prevent="open"
          @keydown.space.prevent="open"
        >
          <span v-if="value">{{ `${value} (${labelFor(value)})` }}</span>
          <span v-else class="text-grey-dark">{{ hint }}</span>
          <div class="float-right flex items-center pointer-events-none">
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
        </div>
        <GenericButtonTertiary class="ml-2" @click="clear"
          >Clear</GenericButtonTertiary
        >
      </div>

      <!-- Popover -->

      <div
        v-show="isOpen"
        class="absolute top-0 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 pin-x p-2 z-50 w-full"
      >
        <input
          ref="search"
          v-model="search"
          type="text"
          class="block mb-2 w-full px-3 py-2 bg-grey-darker rounded"
          style="outline: 0"
          @keydown.up="highlightPrev"
          @keydown.down="highlightNext"
          @keydown.enter.prevent="commitSelection"
          @keydown.esc="cancel"
          @keydown.tab.prevent
        />
        <ul
          v-show="options.length > 0"
          ref="options"
          class="list-reset relative overflow-y-scroll"
          style="max-height: 200px"
        >
          <li
            v-for="(option, i) in filteredOptions"
            ref="option"
            :key="option"
            class="px-3 py-2 cursor-pointer rounded"
            :class="[
              i === highlightedIndex ? 'bg-indigo-50' : 'hover:bg-grey-darker',
            ]"
            @click="select(i)"
          >
            {{
              labels && labels.length === options.length
                ? `${option} (${labelFor(option)})`
                : option
            }}
          </li>
        </ul>
        <div v-show="filteredOptions.length === 0" class="px-3 py-2 text-grey">
          No results found for "{{ search }}"
        </div>
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
  },

  data() {
    return {
      search: '',
      isOpen: false,
      highlightedIndex: 0,
    }
  },

  computed: {
    filteredOptions() {
      if (!this.labels) {
        return this.options.filter((option) =>
          option.toLowerCase().startsWith(this.search.toLowerCase())
        )
      }
      return this.options.filter(
        (option, index) =>
          option.toLowerCase().startsWith(this.search.toLowerCase()) ||
          this.labels[index].toLowerCase().startsWith(this.search.toLowerCase())
      )
    },
  },

  methods: {
    open() {
      this.isOpen = true
      this.$nextTick(() => {
        this.$refs.search.focus()
      })
    },
    close() {
      this.isOpen = false
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    cancel() {
      this.close()
    },
    commitSelection() {
      this.$emit('input', this.filteredOptions[this.highlightedIndex])
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
      console.log(this.$refs.option[index])
      this.$nextTick(() => {
        this.$refs.option[index].scrollIntoView({ block: 'nearest' })
      })
    },
    highlightPrev() {
      console.log('highlightPrev')
      this.highlight(
        this.highlightedIndex - 1 < 0
          ? this.filteredOptions.length - 1
          : this.highlightedIndex - 1
      )
    },
    highlightNext() {
      console.log('highlightNext')
      this.highlight(
        this.highlightedIndex + 1 >= this.filteredOptions.length
          ? 0
          : this.highlightedIndex + 1
      )
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
