<template>
  <div class="header">
    <span @click="handleExpand(!expand)">
      <app-icon iconClass="menu"></app-icon>
    </span>
    <ul class="nav">
      <li>
        <router-link v-if="!user" :to="'login'">登录</router-link>
        <span v-else>{{user}}</span>
      </li>
      <li>
        <router-link v-if="!user" :to="'register'">注册</router-link>
        <span v-else @click="logout">退出</span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import UserService from "@/services/user.service";
import { expand } from "rxjs/operators";
@Component
export default class AppHeader extends Vue {
  @Getter("user", { namespace: "operation" })
  user!: string;

  @Mutation("logout", { namespace: "operation" })
  logout() {}

  @Getter("status", { namespace: "operation" })
  status!: boolean;
  @Watch("status")
  watchStatus(newVal: boolean, oldVal: boolean) {
    if (!newVal) {
      this.$router.push({
        path: "/login",
        query: { redirect: this.$route.path }
      });
    }
  }

  @Getter("expand") expand!: boolean;

  @Mutation("expand")
  handleExpand(cond: boolean) {}
}
</script>
<style lang="scss" scoped>
.header {
  height: 60px;
  line-height: 60px;
  box-shadow: 0 1px 1px #ccc;
  padding: 0 10px;
  z-index: 1;
  .nav {
    float: right;
    margin: 0;
    li {
      float: left;
      list-style: none;
      a {
        display: block;
        padding: 0 10px;
        color: #888;
        text-decoration: none;
        &:hover {
          color: #000;
        }
      }
      span {
        cursor: pointer;
        display: block;
        padding: 0 10px;
        color: #888;
        &:hover {
          color: #000;
        }
      }
    }
  }
}
</style>

