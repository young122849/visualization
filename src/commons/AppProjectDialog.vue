<template>
  <div class="project-dialog">
    <el-dialog :title="title" :visible.sync="show" width="30%">
      <el-form :model="form" ref="form" :rules="rules" label-width="80px">
        <el-form-item label="项目名称" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="项目描述" prop="desc">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
      </el-form>
      <div class="cover-container"> 
        <div class="selected-cover">
          <span>选择封面</span>
          <img :src="require('../assets/img/covers/' + selectedImg)">
        </div>
        <div class="cover-list">
          <div @click="handleSelect(img)" class="cover" v-for="(img, index) in imgs" :key="index">
            <img :src="require('../assets/img/covers/' + img)" >
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleProject(type, false)">取 消</el-button>
        <el-button type="primary" @click="handleProject(type, true, form)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
import { Project } from "@/models/project";
@Component
export default class AppProjectDialog extends Vue {
  show: boolean = true;
  // 当更新项目时，会由Project组件将数据传递至对话框
  @Prop() data!: Project;
  selectedImg = Math.round(Math.random() * 39) + "_tn.jpg";
  type: string = "create";
  imgs: string[] = [];
  title: string = "";
  constructor() {
    super();
    for (let i = 0; i < 40; ++i) {
      this.imgs.push(`${i}_tn.jpg`);
    }
    if (this.data !== null) {
      this.type = "update";
      this.title = "更新项目";
      this.form.title = this.data.title;
      this.form.desc = this.data.desc;
      this.form.img = this.data.img;
      this.selectedImg = this.form.img;
    } else {
      this.type = "create";
      this.title = "新建项目";
      this.form.title = "";
      this.form.desc = "";
      this.form.img = this.selectedImg;
    }
  }

  form: Project = {
    title: "",
    desc: "",
    img: ""
  };
  rules: any = {
    title: [{ required: true, message: "请输入标题", trigger: "blur" }],
    desc: [{ required: true, message: "请输入描述信息", trigger: "blur" }]
  };
  rels: any = null;

  // 当新建或更新项目时，需要将条件发送出去
  handleProject(type: string, cond: boolean, project: Project) {
    // 点击了确认按钮，此时应进行输入验证
    if (cond === true) {
      this.rels = this.$refs["form"];
      this.rels.validate((valid: boolean) => {
        if (valid) {
          if (type === "update") {
            project._id = this.data._id;
          }
          this.$emit(type, cond, project);
        } else {
        }
      });
    } else {
      this.$emit(type, cond);
    }
  }

  handleSelect(img: string) {
    this.form.img = img;
    this.selectedImg = img;
  }
}
</script>
<style lang="scss" scoped>
.project-dialog {
  & .selected-cover {
    box-sizing: border-box;
    width: 25%;
    padding: 3px;
    & img {
      width: 100%;
    }
  }
  & .cover-list {
    height: 200px;
    overflow: auto;
  }
  & .cover {
    float: left;
    box-sizing: border-box;
    padding: 3px;
    width: 25%;
    & img {
      width: 100%;
    }
  }
}
</style>


