<template>
  <li>
    <div class="block h-20 hover:bg-gray-50">
      <div class="flex animate-pulse items-center px-4 py-4 sm:px-6">
        <div class="flex min-w-0 flex-1 items-center">
          <div class="grid w-full min-w-0 grid-cols-3 md:gap-4 lg:grid-cols-4">
            <!-- Name, DoB, gender -->
            <div class="col-span-2 space-y-1">
              <div class="h-4 w-1/2 rounded bg-gray-200"></div>
              <div class="h-4 w-full rounded bg-gray-200"></div>
            </div>
            <!-- National ID -->
            <div class="space-y-1">
              <div class="h-4 w-full rounded bg-gray-200 sm:w-1/2"></div>
              <div class="h-4 w-full rounded bg-gray-200 sm:w-1/4"></div>
            </div>
            <!-- Details (large breakpoint only) -->
            <div class="hidden space-y-1 lg:block">
              <div class="h-4 w-full rounded bg-gray-200 sm:w-1/3"></div>
              <div class="h-4 w-full rounded bg-gray-200 sm:w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>
