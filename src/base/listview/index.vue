
<template>
  <scroll class="listview" :probeType="2" :listenScroll="true" @scroll="scroll" :list="list" ref="listview">
    <ul>
      <li v-for="(group,x) in list" :key="x" ref="listgroup" class="group">
        <h2 class="title">{{group.title}}</h2>
        <ul class="cnt">
          <li @click.prevent="selectItem(item)" v-for="(item,y) in group.items" :key="y" class="item">
            <img class="avatar" v-lazy="item.avatar" :alt="item.name">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="shoutcut" @touchstart="onShortCutTouchStart" @touchmove.stop="onShourtCutTouchMove">
      <ul>
        <li v-for="(item,x) in shoutCutList" :key="x" :data-index="x" :class="{'active':curIndex===x}" class="item">{{item}}</li>
      </ul>
    </div>
    <div v-show="fixedTitle" class="list-fixed" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!list.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from "@/base/scroll";
import Loading from "@/base/loading";
import { getData } from "@/assets/js/dom";
export default {
  props: {
    list: {
      type: Array,
      default: null
    }
  },
  data() {
    // 在这里定义touch 是为了不需要vue去监听touch的变化
    this.touch = {};
    this.listHeight = [];
    // 标题高度
    this.titleHeight = 30;
    return {
      scrollY: -1,
      curIndex: 0,
      diff: -1
    };
  },
  computed: {
    shoutCutList() {
      return this.list.map(el => {
        return el.title.substr(0, 1);
      });
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.list[this.curIndex] ? this.list[this.curIndex].title : "";
    }
  },
  watch: {
    list() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY, oldY) {
      const listHeight = this.listHeight;
      for (let i = 0, len = listHeight.length; i < len; ++i) {
        let h1 = listHeight[i];
        let h2 = listHeight[i + 1];
        if (h2 && (-newY > h1 && -newY < h2)) {
          this.curIndex = i + 1;
          // 用下一个块的起始值减去滚动的高度就表示相差高度
          this.diff = h2 + newY;
          return;
        }
      }
      this.curIndex = 0;
    },
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < this.titleHeight ? newVal - this.titleHeight : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    }
  },
  methods: {
    refresh() {
      this.$refs.listview.refresh();
    },
    selectItem(item) {
      this.$emit("select", item);
    },
    onShortCutTouchStart(e) {
      // 获取当前点击dom的data-index属性的值
      // 因为获取的值为字符串所以下面值相加会出现问题 所以这里向下取整
      let anchorIndex = getData(e.target, "index") | 0;
      // 获取鼠标移动起始touch的y轴坐标
      this.touch.y1 = e.touches[0].pageY;
      // 获取和设置锚点的高度
      this.touch.anchorHeight = e.target.clientHeight;
      // 设置开始的锚点index
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    onShourtCutTouchMove(e) {
      // 获取移动中的鼠标y轴坐标
      this.touch.y2 = e.touches[0].pageY;
      // (开始的y轴坐标-终止y轴坐标)/每个锚点的高度|0  == 滑动了几个描点
      // |0表示向下取整
      let delta =
        ((this.touch.y2 - this.touch.y1) / this.touch.anchorHeight) | 0;
      // 设置移动中的锚点index
      let anchorIndex = this.touch.anchorIndex + delta;
      this._scrollTo(anchorIndex);
    },
    _scrollTo(index) {
      // 点击锚点直接变色
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 1) {
        index = this.listHeight.length - 1;
      }
      this.curIndex = index;
      // 调用listview的滚动事件
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0);
    },
    scroll(pos, currentPage) {
      this.scrollY = pos.y;
    },
    _calculateHeight() {
      /* 计算每一块的高度 */
      this.listHeight = [];
      const list = this.$refs.listgroup;
      this.listHeight.fill(0);
      let initHeight = 0;
      Array.from(list, el => {
        initHeight += el.clientHeight;
        this.listHeight.push(initHeight);
      });
    }
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style scoped lang="less">
@import "~assets/less/variable.less";

.listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: @color-background;
    .group {
        padding-bottom: 30px;
        .title {
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            font-size: @font-size-small;
            color: @color-text-l;
            background-color: @color-highlight-background;
        }
        .item {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            padding: 10px 0;
            .avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                flex: 0 1 auto;
            }
            .name {
                margin-left: 20px;
                color: @color-text-l;
                font-size: @font-size-medium;
            }
        }
    }
    .shoutcut {
        position: absolute;
        z-index: 1;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        padding: 10px 0;
        border-radius: 10px;
        text-align: center;
        background-color: @color-background-d;
        font-family: Helvetica;
        .item {
            padding: 3px;
            line-height: 1;
            color: @color-text-l;
            font-size: @font-size-small;
            &.active {
                color: @color-theme;
            }
        }
    }
    .list-fixed {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        .fixed-title {
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            font-size: @font-size-small;
            color: @color-text-l;
            background-color: @color-highlight-background;
        }
    }
    .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
}
</style>
