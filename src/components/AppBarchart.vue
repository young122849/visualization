<template>
  <div class="barchart"></div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Getter } from "vuex-class";
import Barchart from "@/charts/barchart";
@Component
export default class AppBarchart extends Vue {
  @Getter("loadData", { namespace: "charts" })
  data!: any[];
  chart!: Barchart;

  @Watch("data")
  watchData(newVal: any) {
    this.chart.update(newVal);
  }
  mounted() {
    this.chart = new Barchart({
      target: ".barchart",
      margin: {
        top: 10,
        right: 50,
        bottom: 10,
        left: 50
      }
    });
  }
}
</script>

