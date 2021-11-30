<template>
  <transition :duration="200">
    <div class="relative">
      <!-- Background overlay, show/hide based on modal state. -->
      <GenericBlackout :visible="closable && isOpen" @click="cancel()" />

      <!-- Main component -->
      <div class="flex w-full">
        <div
          ref="mainInput"
          class="flex items-center truncate w-full border px-3 py-2 shadow-sm sm: border-gray-300 rounded-md"
          :class="{
            invisible: isOpen,
          }"
          tabindex="0"
          @click="open"
          @keydown.up.prevent="open"
          @keydown.down.prevent="open"
          @keydown.space.prevent="open"
          @keydown.enter.prevent="open"
        >
          <div class="flex-grow truncate">
            <span v-if="value" class="truncate line-clamp-1">{{ `${value} (${labelFor(value)})` }}</span>
            <span v-else class="truncate line-clamp-1 text-grey-dark text-base">{{ hint }}</span>
          </div>

          <div class="flex-shrink items-center pointer-events-none">
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
        <GenericButton colour="white" class="ml-2" @click="clear">Clear</GenericButton>
      </div>

      <!-- Popover -->

      <div
        v-show="isOpen"
        class="absolute top-0 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 pin-x px-2 pt-2 z-50 w-full"
      >
        <input
          ref="searchInput"
          v-model="search"
          type="text"
          class="block w-full px-3 py-2 bg-grey-darker rounded"
          style="outline: 0"
          @keydown.up="highlightPrev"
          @keydown.down="highlightNext"
          @keydown.enter.prevent="commitSelection"
          @keydown.esc="cancel"
          @keydown.tab.prevent
        />
        <ul
          v-show="options.length > 0"
          ref="optionsElement"
          class="list-reset relative overflow-y-scroll py-2"
          style="max-height: 200px"
        >
          <li
            v-for="(option, i) in filteredOptions"
            ref="optionElement"
            :key="option"
            class="px-3 py-2 cursor-pointer rounded"
            :class="[i === highlightedIndex ? 'bg-indigo-50' : 'hover:bg-grey-darker']"
            @click="select(i)"
          >
            {{ labels && labels.length === options.length ? `${option} (${labelFor(option)})` : option }}
          </li>
        </ul>
        <div v-show="filteredOptions.length === 0" class="px-3 py-2 text-grey">No results found for "{{ search }}"</div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    value: {
      type: String,
      required: false,
      default: null,
    },
    options: {
      type: Array as () => String[],
      required: true,
    },
    labels: {
      type: Array as () => String[],
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
    closable: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  setup(props, { emit }) {
    const search = ref('')
    const isOpen = ref(false)
    const highlightedIndex = ref(0)

    const searchInput = ref()
    const mainInput = ref()
    const optionElement = ref()

    const filteredOptions = computed(() => {
      if (!props.labels) {
        return props.options.filter((option) => option.toLowerCase().startsWith(search.value.toLowerCase()))
      }
      return props.options.filter(
        (option, index) =>
          option.toLowerCase().startsWith(search.value.toLowerCase()) ||
          props.labels[index].toLowerCase().startsWith(search.value.toLowerCase())
      )
    })

    function open() {
      isOpen.value = true
      nextTick(() => {
        searchInput.value.focus()
      })
    }

    function close() {
      if (props.closable) {
        isOpen.value = false
        nextTick(() => {
          mainInput.value.focus()
        })
      }
    }

    function cancel() {
      close()
    }

    function commitSelection() {
      close()
      emit('input', filteredOptions.value[highlightedIndex.value])
    }

    function select(index: number) {
      highlightedIndex.value = index
      commitSelection()
    }

    function clear() {
      highlightedIndex.value = 0
      emit('input', null)
      close()
    }

    function highlight(index: number) {
      open()
      highlightedIndex.value = index
      optionElement.value[index].scrollIntoView({ block: 'nearest' })
    }

    function highlightPrev() {
      highlight(highlightedIndex.value - 1 < 0 ? filteredOptions.value.length - 1 : highlightedIndex.value - 1)
    }

    function highlightNext() {
      highlight(highlightedIndex.value + 1 >= filteredOptions.value.length ? 0 : highlightedIndex.value + 1)
    }

    function labelFor(value: string) {
      if (props.labels) {
        const index = props.options.indexOf(value)
        if (index) {
          return props.labels[index]
        }
      }
      return value
    }

    onMounted(() => {
      if (props.mountOpened) {
        open()
      }
    })

    return {
      searchInput,
      mainInput,
      optionElement,
      search,
      isOpen,
      highlightedIndex,
      filteredOptions,
      open,
      close,
      cancel,
      select,
      highlightNext,
      highlightPrev,
      clear,
      commitSelection,
      labelFor,
    }
  },
})
</script>
