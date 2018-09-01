<template>
  <div class="login">
    <div class="login-container">
      <div class="login-header">
        <h1>
          <span class="active">登录</span>
          <span>注册</span>
        </h1>
      </div>
      <div class="login-content">
        <el-form :model="form" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">登录</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

import UserService, { User } from "../services/user.service";
import { Action, Getter } from "vuex-class";
import { operation } from "@/stores/operation";
@Component
export default class Login extends Vue {
  public form: any = {
    username: "",
    password: ""
  };
  public service: UserService = new UserService();

  @Action("login", { namespace: "operation" })
  loginForm!: any;
  @Getter("status", { namespace: "operation" })
  status!: boolean;
  @Watch("status")
  watchStatus(newVal: boolean, oldVal: boolean) {
    if (newVal) {
      this.$router.push(
        this.$route.query.redirect ? this.$route.query.redirect : "/"
      );
    }
  }
  onSubmit() {
    this.loginForm({
      username: this.form.username,
      password: this.form.password
    });
  }
  mounted() {
    // 已登录
    if (this.status) {
      this.$router.push(
        this.$route.query.redirect ? this.$route.query.redirect : "/"
      );
    }
  }
}
</script>
<style lang="scss" scoped>
.login-container {
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 340px;
  height: 272px;
  margin: auto;
  background: #fff;
  z-index: 200;
  padding: 0 10px;
}
.login-header {
  h1 {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #888;
    margin: 0;
    font-size: 18px;
    font-weight: normal;
    span {
      display: block;
      padding: 0 5px;
      float: left;
      &.active {
        color: #f10400;
        border-bottom: 1px solid #f10400;
      }
      &:hover {
        color: #f10400;
        border-bottom: 1px solid #f10400;
      }
    }
  }
}
.login-content {
  padding: 20px 20px;
}
</style>

