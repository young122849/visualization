<template>
  <div class="parallel-coordinate"></div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Getter } from "vuex-class";
import ParallelCoordinate from "@/charts/parallel-coordinate";
@Component
export default class AppParallelCoordinate extends Vue {
  @Getter("loadData", { namespace: "charts" })
  data!: any[];
  chart!: ParallelCoordinate;
  @Watch("data")
  watchData(newVal: any) {
    this.chart.update(newVal);
  }
  mounted() {
    this.chart = new ParallelCoordinate({
      target: ".parallel-coordinate",
      margin: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
      }
    });
  }
}
</script>

