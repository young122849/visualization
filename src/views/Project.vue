<template>
  <div class="project">
    <app-project-item :item="item" v-for="(item, index) in projectItems" :key="index"
     @update="handleUpdate(item)"
     @delete="handleDelete(item)"></app-project-item>
    <el-button @click="handleCreate" class="add-button" circle icon="el-icon-edit" type="danger"></el-button>
    <app-project-dialog v-if="newDialog"
     :data="projectDetail" 
     @create="confirmCreate"
     @update="confirmUpdate"
     ></app-project-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppProjectItem from "@/components/AppProjectItem.vue";
import AppProjectDialog from "@/commons/AppProjectDialog.vue";
import { Project } from "@/models/Project.ts";
import { Action, Getter } from "vuex-class";
import ProjectService from "@/services/project.service";
import { renderQueue } from "@/utils/render-queue.ts";
import { Route } from "vue-router";
@Component({
  components: {
    AppProjectItem,
    AppProjectDialog
  },
  beforeRouteEnter(to, from, next) {
    let service: ProjectService = ProjectService.getInstance();
    service.loadProjects("http://localhost:3000/projects").subscribe(val => {
      next(vm => {
        vm.$store.commit("projects/getProjects", val.data);
      });
    });
  }
})
export default class AppProject extends Vue {
  confirmDelete: boolean = false;
  newDialog: boolean = false;
  projectDetail: any = null;
  data: object = {};

  service: ProjectService = new ProjectService();

  @Action("addProject", { namespace: "projects" })
  addProject(project: Project) {}

  @Action("delProject", { namespace: "projects" })
  delProject(id: any) {}

  @Action("updateProject", { namespace: "projects" })
  updateProject(project: Project) {}

  @Getter("projects", { namespace: "projects" })
  projectItems!: Project[];

  rq: any = renderQueue(this, function(array: any) {
    console.log(array);
  });

  // 打开新建项目对话框
  handleCreate() {
    this.projectDetail = null;
    this.newDialog = true;
  }

  //确认是否要新建项目
  confirmCreate(cond: boolean, project: Project) {
    // 确认新建项目
    const self: any = this;
    if (cond === true) {
      this.addProject(project);
      self.$message({
        type: "success",
        message: "创建项目成功"
      });
    } else {
      self.$message({
        type: "info",
        message: "取消新建项目"
      });
    }
    //关闭对话框
    this.newDialog = false;
  }

  handleDelete(item: Project) {
    const self: any = this;
    self
      .$confirm(`是否删除${item.title}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        this.delProject(item._id);
        self.$message({
          type: "success",
          message: "删除成功"
        });
      })
      .catch(() => {
        self.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }

  handleUpdate(project: Project) {
    this.newDialog = true;
    this.projectDetail = project;
  }

  // 确认是否要更新项目
  confirmUpdate(cond: boolean, project: Project) {
    const self: any = this;
    if (cond === true) {
      // 确认需要更新项目
      this.updateProject(project);
      self.$message({
        type: "success",
        message: "成功更新项目"
      });
    } else {
      self.$message({
        type: "info",
        message: "取消更新项目"
      });
    }
    this.newDialog = false;
  }
}
</script>
<style lang="scss" scoped>
.project {
  box-sizing: border-box;
  height: 100%;
  padding: 20px;
  overflow: auto;
}
.add-button {
  position: fixed;
  right: 32px;
  bottom: 60px;
}
</style>


