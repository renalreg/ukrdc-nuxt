<template>
  <div class="min-w-0 flex-1 xl:col-span-6">
    <div class="flex items-center gap-2 pb-4 md:mx-auto">
      <div class="w-full">
        <label for="search" class="sr-only">Search</label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <!-- Heroicon name: solid/search -->
            <svg
              class="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <form @submit.prevent="$emit('submit')">
            <FormTextBox
              :focus="true"
              class="w-full pl-10"
              placeholder="Search"
              type="search"
              :value="value"
              v-on="$listeners"
            />
          </form>
        </div>
      </div>
      <GenericButton v-if="showButton" @click="$emit('submit')">Search</GenericButton>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    value: {
      type: String,
      default: "",
    },
    focus: {
      type: Boolean,
      required: false,
      default: false,
    },
    showButton: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
});
</script>
