<template>
  <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 md:-mx-8">
    <div class="inline-block min-w-full overflow-hidden py-2 px-4 align-middle sm:px-6 md:px-8">
      <GenericCard>
        <table class="min-w-full divide-y divide-gray-200">
          <slot></slot>
        </table>
      </GenericCard>
    </div>
  </div>
</template>
