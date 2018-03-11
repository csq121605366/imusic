<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :key="index" :class="{active:currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { addClass } from "@/assets/js/dom";
export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4e3
    },
    speed: {
      type: Number,
      default: 4e2
    },
    threshold: {
      type: Number,
      default: 0.3
    },
    click: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      children: [],
      dots: [],
      currentPageIndex: 0
    };
  },
  mounted() {
    // 初始化操作
    setTimeout(() => {
      this._setSliderWidth();
      this._initDots();
      this._initSlider();

      if (this.autoPlay) {
        this._play();
      }
    }, 20);
    // 屏幕resize时自动变化
    window.addEventListener("resize", () => {
      // 如果slide实例不存在或者不可用 就不做处理
      if (!this.slide || !this.slide.enabled) {
        return;
      }
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        // 判断当前是否处于滚动状态
        if (this.slide.isInTransition) {
          this._onScrollEnd();
        } else {
          if (this.autoPlay) {
            this._play();
          }
        }
        this._refresh();
      }, 60);
    });
  },
  // keep-alive 组件激活时调用。
  activated() {
    this.slide.enable();
    let pageIndex = this.slide.getCurrentPage().pageX;
    this.currentPageIndex = pageIndex;
    this.slide.goToPage(pageIndex, 0, 0);
    if (this.autoPlay) {
      this._play();
    }
  },
  // keep-alive 组件停用时调用。
  deactivated() {
    this.slide.disable();
    clearTimeout(this.timer);
  },
  // 实例销毁之前调用。在这一步，实例仍然完全可用。
  beforeDestroy() {
    this.slide.disable();
    clearTimeout(this.timer);
  },
  methods: {
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children;
      let width = 0;
      // 轮播图单个图片宽度
      let sliderWidth = this.$refs.slider.clientWidth;
      // 遍历图片dom节点 增加类名并且设置宽度
      Array.from(this.children, el => {
        addClass(el, "slider-item");
        el.style.width = sliderWidth + "px";
        width += sliderWidth;
      });
      // 如果循环播放则 两边要各加上一个宽度
      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      // 设置总宽度
      this.$refs.sliderGroup.style.width = width + "px";
    },
    _initDots() {
      this.dots = new Array(this.children.length);
    },
    _initSlider() {
      this.slide = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        click: this.click,
        snap: {
          loop: this.loop,
          threshold: this.threshold,
          speed: this.speed
        }
      });

      this.slide.on("scrollEnd", this._onScrollEnd);
    },
    _onScrollEnd() {
      // 获取当前页面index
      let pageIndex = this.slide.getCurrentPage().pageX;
      this.currentPageIndex = pageIndex;
      if (this.autoPlay) {
        this._play();
      }
    },
    _play() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.slide.next();
      }, this.interval);
    },
    _refresh() {
      if (this.slide) {
        this._setSliderWidth(true);
        this.slide.refresh();
      }
    }
  }
};
</script>

<style scoped lang="less">
@import "~assets/less/variable.less";
.slider {
  position: relative;
  min-height: 1px;
  overflow: hidden;
  .slider-group {
    position: relative;
    white-space: nowrap;
    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }
      img {
        display: block;
        width: 100%;
      }
    }
  }
  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    transform: translateZ(1px);
    text-align: center;
    font-size: 0;
    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: @color-text-l;
      &.active {
        width: 20px;
        border-radius: 5px;
        background: @color-text-ll;
      }
    }
  }
}
</style>
