<template>
  <div>
    <div v-if="facilityDemographicStats">
      <GenericCard class="mb-4">
        <GenericCardHeader class="flex items-center">
          <TextH2 class="flex-1"> Age Distribution </TextH2>
          <GenericButtonMini @click="exportAgeDistribution">Export</GenericButtonMini>
        </GenericCardHeader>
        <PlotBar
          id="ageDistributionChart"
          :y="ageDistributionChartData.data"
          :x="ageDistributionChartData.labels"
          y-label="Number of Patients"
          x-label="Age"
          class="h-64"
          hovertemplate="Age: <b>%{x}</b><br>%{y}<extra></extra>"
        />
      </GenericCard>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GenericCard>
          <GenericCardHeader class="flex items-center">
            <TextH2 class="flex-1"> Gender Distribution </TextH2>
            <GenericButtonMini @click="exportGenderDistribution">Export</GenericButtonMini>
          </GenericCardHeader>
          <PlotDoughnut
            id="genderDistributionChart"
            :data="genderDistributionChartData.data"
            :labels="genderDistributionChartData.labels"
            class="h-64"
          />
        </GenericCard>
        <GenericCard>
          <GenericCardHeader class="flex items-center">
            <TextH2 class="flex-1"> Ethnicity Distribution </TextH2>
            <GenericButtonMini @click="exportEthnicityDistribution">Export</GenericButtonMini>
          </GenericCardHeader>
          <PlotDoughnut
            id="ethnicityDistributionChart"
            :data="ethnicityDistributionChartData.data"
            :labels="ethnicityDistributionChartData.labels"
            class="h-64"
          />
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
import { buildCsv } from "~/helpers/utils/exportUtils";
import { saveAs } from "~/helpers/utils/fileUtils";

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
        .getFacilityDemographics({
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

    // Exporters

    function exportAgeDistribution() {
      const rows: (string | number)[][] = [["age", "count"]];
      for (let i = 0; i < ageDistributionChartData.value.labels.length; i++) {
        rows.push([ageDistributionChartData.value.labels[i], ageDistributionChartData.value.data[i]]);
      }

      const blob = new Blob([buildCsv(rows)], { type: "text/plain;charset=utf-8" });
      saveAs(blob, `age-distribution-${props.facility.id}.csv`);
    }

    function exportGenderDistribution() {
      const rows: (string | number)[][] = [["gender", "count"]];
      for (let i = 0; i < genderDistributionChartData.value.labels.length; i++) {
        rows.push([genderDistributionChartData.value.labels[i], genderDistributionChartData.value.data[i]]);
      }

      const blob = new Blob([buildCsv(rows)], { type: "text/plain;charset=utf-8" });
      saveAs(blob, `gender-distribution-${props.facility.id}.csv`);
    }

    function exportEthnicityDistribution() {
      const rows: (string | number)[][] = [["ethnicity", "count"]];
      for (let i = 0; i < ethnicityDistributionChartData.value.labels.length; i++) {
        rows.push([ethnicityDistributionChartData.value.labels[i], ethnicityDistributionChartData.value.data[i]]);
      }

      const blob = new Blob([buildCsv(rows)], { type: "text/plain;charset=utf-8" });
      saveAs(blob, `ethnicity-distribution-${props.facility.id}.csv`);
    }

    return {
      facilityDemographicStats,
      ageDistributionChartData,
      genderDistributionChartData,
      ethnicityDistributionChartData,
      exportAgeDistribution,
      exportGenderDistribution,
      exportEthnicityDistribution,
    };
  },
});
</script>
