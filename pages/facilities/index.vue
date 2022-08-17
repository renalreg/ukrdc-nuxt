<template>
  <div>
    <TextH1 class="mb-2">Renal Facilities</TextH1>
    <div class="mb-4 flex flex-col gap-2">
      <FormCheckbox
        v-model="includeInactive"
        label="Include facilities who have not sent any data files in the last 12 months"
      />
      <FormCheckbox v-model="includeEmpty" label="Include facilities who have no patient records held in the UKRDC" />
    </div>

    <FacilitiesTable
      :include-empty="includeEmpty"
      :include-inactive="includeInactive"
      @select="$router.push({ path: `/facilities/${$event}` })"
    />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  setup() {
    const includeInactive = ref(true);
    const includeEmpty = ref(false);

    return { includeInactive, includeEmpty };
  },
});
</script>
