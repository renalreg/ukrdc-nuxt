<template>
  <li>
    <div class="block hover:bg-gray-50 h-20">
      <div class="animate-pulse flex items-center px-4 py-4 sm:px-6">
        <div class="min-w-0 flex-1 flex items-center">
          <div class="min-w-0 grid grid-cols-3 lg:grid-cols-4 md:gap-4 w-full">
            <!-- Name, DoB, gender -->
            <div class="col-span-2 space-y-1">
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              <div class="h-4 bg-gray-200 rounded w-full"></div>
            </div>
            <!-- National ID -->
            <div class="space-y-1">
              <div class="h-4 bg-gray-200 rounded w-full sm:w-1/2"></div>
              <div class="h-4 bg-gray-200 rounded w-full sm:w-1/4"></div>
            </div>
            <!-- Details (large breakpoint only) -->
            <div class="hidden lg:block space-y-1">
              <div class="h-4 bg-gray-200 rounded w-full sm:w-1/3"></div>
              <div class="h-4 bg-gray-200 rounded w-full sm:w-1/2"></div>
            </div>
          </div>
        </div>
        <div>
          <IconChevronRight />
        </div>
      </div>
    </div>
  </li>
</template>
