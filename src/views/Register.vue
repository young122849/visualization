<template>
  <div class="register">
    <div class="register-container">
      <div class="register-header">
        <h1>
          <span>登录</span>
          <span class="active">注册</span>
        </h1>
      </div>
      <div class="register-content">
        <el-form rel="form" :rules="rules" :model="form" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="form.value" type="primary" @click="onSubmit">注册</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import UserService from "../services/user.service";
@Component
export default class Login extends Vue {
  public form: any = {
    username: "",
    password: ""
  };
  public rules: any = {
    username: [
      { required: true, message: "请输入用户名", trigger: "blur" },
      { min: 3, max: 15, message: "长度在3-15个字符", trigger: "blur" },
      {
        validator: function(rule: any, value: string, callback: any) {
          let reg = /^[a-zA-Z]+[0-9a-zA-Z]+$/;
          if (!reg.test(value)) {
            callback(new Error("请以字母开头"));
          }
        },
        trigger: "blur"
      }
    ],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }]
  };
  public service: UserService = new UserService();
  onSubmit() {
    this.service.register("http://localhost:3000/register", {
      username: this.form.username,
      password: this.form.password
    });
  }
}
</script>
<style lang="scss" scoped>
.register-container {
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
.register-header {
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
.register-content {
  padding: 20px 20px;
}
</style>

