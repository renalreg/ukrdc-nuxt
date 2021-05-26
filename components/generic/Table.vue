<template>
  <div class="-my-2 -mx-4 sm:-mx-6 md:-mx-8 overflow-x-auto">
    <div class="py-2 px-4 sm:px-6 md:px-8 align-middle inline-block min-w-full overflow-hidden">
      <GenericCard>
        <table class="min-w-full divide-y divide-gray-200">
          <slot></slot>
        </table>
      </GenericCard>
    </div>
  </div>
</template>
