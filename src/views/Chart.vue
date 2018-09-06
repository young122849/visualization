<template>
  <div class="chart">
    <component :is="chartType"></component>
    <div class="table">
      <el-table
      :data="selected"
      height="100%"
      >
      <el-table-column :prop="title" v-for="(title, index) of titles" :key="index" :label="title"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import AppParallelCoordinate from "@/components/AppParallelCoordinate.vue";
import AppBarchart from "@/components/AppBarchart.vue";
import AppScatterplot from "@/components/AppScatterplot.vue";
import { Action, Getter } from "vuex-class";
import { Route } from "vue-router";
@Component({
  components: {
    AppParallelCoordinate,
    AppBarchart,
    AppScatterplot
  },
  beforeRouteUpdate(to: Route, from: Route, next: any) {
    this.chartType = `App${to.query.type
      .replace(/-/g, " ")
      .split(" ")
      .map((str: string) => {
        return str[0].toUpperCase() + str.substr(1);
      })
      .join("")}`;
    this.$store.dispatch("charts/loadData", {
      url: "http://localhost:3000/charts",
      type: to.query.type
    });
    next();
  }
})
export default class Chart extends Vue {
  @Action("loadData", { namespace: "charts" })
  loadData(obj: any) {}

  chartType: string = "";

  // @Watch("data")
  // watchData(newVal: any[], oldVal: any[]) {}

  @Getter("loadTitles", { namespace: "charts" })
  titles!: string[];

  @Getter("loadSelected", { namespace: "charts" })
  selected!: any[];

  // mounted() {
  //   this.chartType = this.$route.query.type;
  //   this.loadData({
  //     url: "http://localhost:3000/charts",
  //     type: this.$route.query.type
  //   });
  // }
}
</script>
<style lang="scss">
.chart {
  position: relative;
  height: 100%;
  & .parallel-coordinate,
  & .barchart,
  & .scatterplot {
    position: relative;
    height: 450px;
    margin: 2px;
    border: 1px solid #ccc;
    & .axis > text {
      fill: #000;
      cursor: pointer;
    }
  }
  & svg,
  & canvas {
    position: absolute;
    left: 0;
    top: 0;
  }
  & .table {
    position: absolute;
    top: 450px;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px;
  }
}
</style>
