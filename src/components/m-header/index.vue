<template>
  <div class="m-header">
      <div class="icon"></div>
      <h1 class="text">I Music</h1>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" rel="stylesheet/less">
@import "~assets/less/variable.less";
@import "~assets/less/mixin.less";

.m-header {
  position: relative;
  height: 44px;
  text-align: center;
  color: @color-theme;
  font-size: 0;
  .icon {
    display: inline-block;
    vertical-align: middle;
    width: 30px;
    height: 32px;
    margin-right: 10px;
    .bg-image("~./logo");
    background-size: 30px 32px;
  }
  .text {
    display: inline-block;
    vertical-align: middle;
    line-height: 44px;
    font-size: @font-size-large;
  }
  .mine {
    position: absolute;
    top: 0;
    right: 0;
    .icon-mine {
      display: block;
      padding: 12px;
      font-size: 20px;
      color: @color-theme;
    }
  }
}
</style>
