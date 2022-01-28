<template>
  <div>
    <div class="mx-auto mb-4 max-w-7xl">
      <h1 class="text-2xl font-semibold text-gray-900">Renal Facilities</h1>
    </div>

    <FacilitiesTable :include-empty="true" @select="$router.push({ path: `/facilities/${$event}` })" />
  </div>
</template>
