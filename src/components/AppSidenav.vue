<template>
  <div class="sidenav" :class="{'active': expand}">
    <div class="menu-container">
      <a href="javascript:;" @click="handleClick('barchart')">
        <span class="icon">
          <app-icon iconClass="stacked"></app-icon>
        </span>
        <p>堆叠柱状图</p>
      </a>
    </div>
    <div class="menu-container">
      <a href="javascript:;" @click="handleClick('parallel-coordinate')">
        <span class="icon">
          <app-icon iconClass="parallel"></app-icon>
        </span>
        <p>平行坐标</p>
      </a>
    </div>
    <div class="menu-container">
      <a href="javascript:;" @click="handleClick('scatterplot')">
        <span class="icon">
          <app-icon iconClass="scatterplot"></app-icon>
        </span>
        <p>散点图</p>
      </a>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";
@Component
export default class AppSidenav extends Vue {
  @Getter("expand") expand!: boolean;

  handleClick(type: string) {
    this.$router.push({
      path: "/charts",
      query: {
        type: type
      }
    });
  }
}
</script>
<style lang="scss" scoped>
.sidenav {
  float: left;
  height: 100%;
  width: 60px;
  background: rgb(48, 65, 86);
  &.active {
    width: 180px;
    & .menu-container p {
      display: block;
    }
  }
  & .menu-container {
    & a {
      display: block;
      height: 60px;
      text-decoration: none;
    }
    & span {
      float: left;
      font-size: 25px;
      text-align: center;
      width: 60px;
      line-height: 60px;
    }
    & p {
      display: none;
      line-height: 60px;
      margin: 0;
      overflow: hidden;
      color: #fff;
      vertical-align: middle;
    }
  }
}
</style>


