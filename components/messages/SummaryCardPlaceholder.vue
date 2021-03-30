<template>
  <div class="bg-white animate-pulse shadow overflow-hidden rounded-md">
    <div class="px-4 py-5 sm:px-6 space-y-1">
      <div class="h-6 bg-gray-200 rounded w-1/3"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
      <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </dt>
          <dd class="mt-1 text-sm text-gray-900">
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </dd>
        </div>
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </dt>
          <dd class="mt-1 text-sm text-gray-900">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          </dd>
        </div>
        <div class="sm:col-span-2">
          <dt class="text-sm font-medium text-gray-500">
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </dt>
        </div>
      </dl>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
