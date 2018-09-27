<template>
  <div class="player">
    <div class="normal-player">
      播放器
    </div>
    <div class="mini-player"></div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="less">
@import "~assets/less/variable.less";
@import "~assets/less/mixin.less";
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: @color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
      .top {
        position: relative;
        margin-bottom: 25px;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
          .icon-back {
            display: block;
            padding: 9px;
            font-size: @font-size-large-x;
            color: @color-theme;
            transform: rotate(-90deg);
          }
        }
      }
    }
  }
}
</style>
