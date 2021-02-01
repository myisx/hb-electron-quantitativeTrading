<template>
  <div id="app">
    <el-container>
      <el-header>
        <title-bar />
      </el-header>
      <el-container style="background: #2b3744;">
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style>
@import '../../static/font/font.css';
#app {
  font-family: "Aa扁圆" !important;
  /* font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif; */
  text-align: center;
}
.el-header {
  position: relative;
  -webkit-app-region: drag;
  text-align: left;
  background-color: #1f2c35;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
</style>

<script>
import TitleBar from "./components/TitleBar.vue"
export default {
  components: {
    TitleBar
  }
}
</script>
