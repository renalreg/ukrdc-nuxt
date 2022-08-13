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
import { computed, defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { FacilityDemographicStats, FacilityDetailsSchema } from "@ukkidney/ukrdc-axios-ts";
import { NumericChartData } from "~/interfaces/charts";
import { formatGender } from "~/helpers/utils/codeUtils";
import useApi from "~/helpers/useApi";

export default defineComponent({
  props: {
    facility: {
      type: Object as () => FacilityDetailsSchema,
      required: true,
    },
  },
  setup(props) {
    const { facilitiesApi } = useApi();

    // Data refs
    const facilityDemographicStats = ref<FacilityDemographicStats>();

    // Data fetching

    onMounted(() => {
      facilitiesApi
        .getFacilityStatsDemographics({
          code: props.facility.id,
        })
        .then((response) => {
          facilityDemographicStats.value = response.data;
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
          labels.push(point.ethnicity || "Undefined");
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
