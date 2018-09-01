<template>
  <div class="project-item" draggable="true" v-drag>
    <h1 class="project-item-title">
      {{item.title}}
    </h1>
    <img draggable="false" class="project-item-img" :src="require('../assets/img/covers/' + item.img)" alt="">
    <p class="project-item-description">
      {{item.desc}}
    </p>
    <div class="project-item-footer">
      <el-button type="primary" @click="launchUpdate">修改</el-button>
      <el-button type="primary" @click="launchDelete">删除</el-button>
    </div>
  </div>
</template>
<script lang="ts">
import Drag from "@/directives/drag";
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
import { Project } from "@/models/project";
@Component({
  directives: {
    Drag
  }
})
export default class AppProjectItem extends Vue {
  @Prop(Object) item!: object;
  @Emit("delete")
  launchDelete() {}
  @Emit("update")
  launchUpdate() {}
}
</script>
<style lang="scss" scoped>
.project-item {
  float: left;
  width: 320px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  margin: 10px;
  transition: all 0.3s;
  &:hover {
    transform: scale(1.05);
  }
  & .project-item-title {
    margin: 0;
    padding: 0 20px;
    font-size: 18px;
    font-weight: normal;
    line-height: 40px;
  }
  & .project-item-description {
    padding: 0 20px;
  }
  & .project-item-img {
    width: 100%;
    height: 180px;
  }
  & .project-item-footer {
    padding: 0 20px;
    margin: 10px 0;
  }
}
</style>


