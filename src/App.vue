<template>
  <div id="app">
    <app-sidenav></app-sidenav>
    <div class="content">
      <app-header></app-header>
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import AppSidenav from "@/components/AppSidenav.vue";
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {
    AppHeader,
    AppSidenav
  }
})
export default class App extends Vue {}
</script>

<style>
html,
body {
  margin: 0;
  height: 100%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  position: relative;
}
.content {
  position: relative;
  height: 100%;
  overflow: hidden;
}
.main {
  position: absolute;
  top: 60px;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>
