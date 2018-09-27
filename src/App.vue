<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import MHeader from "components/m-header";
import Tab from "components/tab";

export default {
  name: "App",
  mounted() {

  },
  components: {
    MHeader,
    Tab
  }
};
</script>

<style lang="less">

</style>
