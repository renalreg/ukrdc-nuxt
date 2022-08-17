<template>
  <div>
    <div v-if="facilityDemographicStats">
      <GenericCard class="mb-4">
        <GenericCardHeader>
          <TextH2> Age Distribution </TextH2>
        </GenericCardHeader>
        <GenericCardContent class="p-4">
          <ChartBar
            id="ageDistributionChart"
            :data="ageDistributionChartData.data"
            :labels="ageDistributionChartData.labels"
            y-label="Number of Patients"
            class="h-64"
          />
        </GenericCardContent>
      </GenericCard>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GenericCard>
          <GenericCardHeader>
            <TextH2> Gender Distribution </TextH2>
          </GenericCardHeader>
          <GenericCardContent class="p-4">
            <ChartDoughnut
              id="genderDistributionChart"
              :data="genderDistributionChartData.data"
              :labels="genderDistributionChartData.labels"
              class="h-64"
            />
          </GenericCardContent>
        </GenericCard>
        <GenericCard>
          <GenericCardHeader>
            <TextH2> Ethnicity Distribution </TextH2>
          </GenericCardHeader>
          <GenericCardContent class="p-4">
            <ChartDoughnut
              id="ethnicityDistributionChart"
              :data="ethnicityDistributionChartData.data"
              :labels="ethnicityDistributionChartData.labels"
              class="h-64"
            />
          </GenericCardContent>
        </GenericCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import fetchFacilities from "~/helpers/fetch/fetchFacilities";
import { Facility, FacilityDemographicStats } from "~/interfaces/facilities";
import { NumericChartData } from "~/interfaces/charts";
import { formatGender } from "~/helpers/utils/codeUtils";

export default defineComponent({
  props: {
    facility: {
      type: Object as () => Facility,
      required: true,
    },
  },
  setup(props) {
    const { fetchFacilityDemographicStats } = fetchFacilities();

    // Data refs
    const facilityDemographicStats = ref<FacilityDemographicStats>();

    // Data fetching

    onMounted(() => {
      fetchFacilityDemographicStats(props.facility).then((response) => {
        facilityDemographicStats.value = response;
      });
    });

    // Data coersion

    const ageDistributionChartData = computed<NumericChartData>(() => {
      const labels: number[] = [];
      const data: number[] = [];

      if (facilityDemographicStats.value) {
        for (const point of facilityDemographicStats.value?.ageDist) {
          labels.push(point.age);
          data.push(point.count);
        }
      }

      return {
        labels,
        data,
      };
    });

    const genderDistributionChartData = computed<NumericChartData>(() => {
      const labels: string[] = [];
      const data: number[] = [];

      if (facilityDemographicStats.value) {
        for (const point of facilityDemographicStats.value?.genderDist) {
          labels.push(formatGender(point.gender));
          data.push(point.count);
        }
      }

      return {
        labels,
        data,
      };
    });

    const ethnicityDistributionChartData = computed<NumericChartData>(() => {
      const labels: string[] = [];
      const data: number[] = [];

      if (facilityDemographicStats.value) {
        for (const point of facilityDemographicStats.value?.ethnicityDist) {
          labels.push(point.ethnicity);
          data.push(point.count);
        }
      }

      return {
        labels,
        data,
      };
    });

    return {
      facilityDemographicStats,
      ageDistributionChartData,
      genderDistributionChartData,
      ethnicityDistributionChartData,
    };
  },
});
</script>
