<template>
  <nav class="nav">
      <router-link exact to="/recommend" tag="div" class="nav-item">
        <span class="nav-link">推荐</span>
      </router-link>
      <router-link to="/singer" tag="div" class="nav-item">
        <span class="nav-link">歌手</span>
      </router-link>
      <router-link to="/rank" tag="div" class="nav-item">
        <span class="nav-link">排行</span>
      </router-link>
      <router-link to="/search" tag="div" class="nav-item">
        <span class="nav-link">搜索</span>
      </router-link>
  </nav>
</template>

<script>
export default {};
</script>

<style scoped lang="less">
@import "~assets/less/variable.less";

.nav {
  display: flex;
  height: 44px;
  line-height: 44px;
  font-size: @font-size-medium;
  .nav-item {
    flex: 1;
    text-align: center;
    &.router-link-active .nav-link {
      color: @color-theme;
      border-bottom: 2px solid @color-theme;
    }
    .nav-link {
      padding-bottom: 5px;
      color: @color-text-l;
    }
  }
}
</style>
