<template>
  <div>
    <div class="max-w-7xl mx-auto mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">Renal Facilities</h1>
    </div>

    <FacilitiesTable :include-empty="true" @select="$router.push({ path: `/facilities/${$event}` })" />
  </div>
</template>
