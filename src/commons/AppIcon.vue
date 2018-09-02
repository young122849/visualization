<template>
  <svg class="svg-icon">
    <use :xlink:href="iconName"></use>
  </svg>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component
export default class AppIcon extends Vue {
  @Prop(String) iconClass!: string;
  get iconName() {
    return `#icon-${this.iconClass}`;
  }
}
</script>
<style lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
  vertical-align: -0.15em;
}
</style>


