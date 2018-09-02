<template>
  <div class="scatterplot"></div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Getter } from "vuex-class";
import Scatterplot from "@/charts/scatterplot";

@Component
export default class AppScatterplot extends Vue {
  @Getter("loadData", { namespace: "charts" })
  data!: any[];
  chart!: Scatterplot;

  @Watch("data")
  watchData(newVal: any) {
    this.chart.update(newVal);
  }
  mounted() {
    this.chart = new Scatterplot({
      target: ".scatterplot",
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


