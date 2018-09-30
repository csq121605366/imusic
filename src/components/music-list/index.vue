<template>
  <div class="music-list">
    <div class="back" @click="back"><i class="icon-back"></i></div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playBtn">
          <i class="icon-play"></i>
          <span class="text">随机播放</span>
        </div>
      </div>
      <div class="filter" ref="bgFliter"></div>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :list="songs" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "@/base/scroll";
import SongList from "@/base/song-list";
import Loading from "@/base/loading";
import { prefixStyle } from "@/assets/js/dom";
import { mapActions } from "vuex";

const transform = prefixStyle("transform");
const filter = prefixStyle("filter");
const RESERVED_HEIGHT = 40;
export default {
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      probeType: 3,
      listenScroll: true,
      scrollY: 0
    };
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },
    selectItem({ song, index }) {
      this.selectPlay({ list: this.songs, index });
    },
    ...mapActions(["selectPlay"])
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.minTranslateY, newY);
      let zIndex = 0;
      let scale = 1;
      let blur = 0;
      this.$refs.bgLayer.style[transform] = `translate3d(0,${translateY}px,0)`;
      let percent = Math.abs(newY / this.imageHeight);
      if (newY > 0) {
        scale = 1 + percent;
        zIndex = 10;
      } else {
        blur = Math.min(20 * percent, 20);
      }
      this.$refs.bgFliter.style[filter] = `blur(${blur}px)`;
      if (newY < this.minTranslateY) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}PX`;
        this.$refs.playBtn.style.display = "none";
      } else {
        this.$refs.bgImage.style.paddingTop = `70%`;
        this.$refs.bgImage.style.height = 0;
        this.$refs.playBtn.style.display = "";
      }

      this.$refs.bgImage.style.zIndex = zIndex;
      this.$refs.bgImage.style[transform] = `scale(${scale})`;
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;

    // if (!this.songs.length) {
    //   this.$router.push("/singer");
    // }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
};
</script>

<style scoped lang="less">
@import "~assets/less/variable.less";
@import "~assets/less/mixin.less";
.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: @color-background;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back {
      display: block;
      padding: 10px;
      font-size: @font-size-large-x;
      color: @color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    .no-wrap;
    text-align: center;
    line-height: 40px;
    font-size: @font-size-large;
    color: @color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
    .play-wrapper {
      position: relative;
      bottom: 50px;
      z-index: 50;
      width: 100%;
      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid @color-theme;
        color: @color-theme;
        border-radius: 100px;
        font-size: 0;
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: @font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: @font-size-small;
        }
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .bg-layer {
    position: relative;
    height: 100%;
    background: @color-background;
  }
  .list {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background: @color-background;
    .song-list-wrapper {
      padding: 20px 30px;
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
