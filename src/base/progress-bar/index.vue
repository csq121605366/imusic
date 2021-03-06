<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtnWp" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend="progressTouchEnd">
        <div class="progress-btn" ref="progressBtn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from '@/assets/js/dom';
const transform = prefixStyle('transform');
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      touch: {
        initiated: false
      },
      barWidth: 0
    }
  },
  methods: {
    progressClick(e) {
      this._offset(e.offsetX);
      this._triggerPercent()
    },
    progressTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) return;
      //横向偏移量
      const deltaX = e.touches[0].pageX - this.touch.startX;
      let max = Math.max(0, this.touch.left + deltaX);
      const offsetWidth = Math.min(this.barWidth, max);
      this._offset(offsetWidth);
    },
    progressTouchEnd(e) {
      this.touch.initiated = false;
      this._triggerPercent();
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    },
    _triggerPercent() {
      const percent = this.$refs.progress.clientWidth / this.barWidth;
      this.$emit('percentChange', percent);
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        this.barWidth = this.$refs.progressBar.clientWidth - this.$refs.progressBtn.offsetWidth;
        const offsetWidth = newPercent * this.barWidth;
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style scoped lang="less">
@import "~assets/less/variable.less";
@import "~assets/less/mixin.less";
.progress-bar {
    height: 30px;
    .bar-inner {
        position: relative;
        top: 13px;
        height: 4px;
        background: rgba(0, 0, 0, 0.3);
        .progress {
            position: absolute;
            height: 100%;
            background: @color-theme;
        }
        .progress-btn-wrapper {
            position: absolute;
            left: -8px;
            top: -13px;
            width: 30px;
            height: 30px;
            .progress-btn {
                position: relative;
                top: 7px;
                left: 7px;
                box-sizing: border-box;
                width: 16px;
                height: 16px;
                border: 3px solid @color-text;
                border-radius: 50%;
                background: @color-theme;
            }
        }
    }
}
</style>
