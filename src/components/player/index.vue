<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" width="100%" height="100%" alt="">
        </div>
        <div class="top">
          <div class="back" @click="playScreen">
            <div class="icon-back"></div>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
          <div class="middle-l" ref="middlel">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdClass"><img class="image" :src="currentSong.image"></div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :list="currentLyric&&currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text" ref="lyricLine" v-for="(line,index) in currentLyric.lines" :key="index" :class="currentLineNum===index?'current':''">
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class=" bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{currentTime|formate}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{currentSong.duration|formate}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click.stop="togglePlay" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" @click="playScreen" v-show="!fullScreen">
        <div class="icon">
          <div class="imgWrapper">
            <img :src="currentSong.image" :class="cdClass" width="40" height="40" alt="">
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlay" class="icon-mini" :class="miniPlayIcon"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="songUrl" v-if="songUrl" ref="audio" @timeupdate="updateTime" @canplay="ready" @error="error" @ended="ended" @pause="paused"></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";
import { prefixStyle } from "@/assets/js/dom";
import { getSongUrl } from "@/api/song";
import ProgressBar from '@/base/progress-bar';
import ProgressCircle from "@/base/progress-circle";
import { playMode } from "@/assets/js/config";
import { shuffle, deepCopy } from '@/assets/js/util';
import Lyric from 'lyric-parser';
import Scroll from '@/base/scroll';

const transform = prefixStyle("transform");
const transitionDuration = prefixStyle("transitionDuration");

export default {
  data() {
    return {
      songUrl: "",
      songReady: false,
      currentTime: 0,
      radius: 32,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',//歌词和cd显示 cd lyric
      touchPercent: 0.2, //触摸滑动敏感系数
      playingLyric: ''
    };
  },
  computed: {
    cdClass() {
      return this.playing ? "play" : "play paused";
    },
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniPlayIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    disableCls() {
      return this.songReady ? "" : "disable"
    },
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    iconMode() {
      return this.mode === playMode.sequence ? "icon-sequence" : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
    },
    ...mapGetters(["fullScreen", "playList", "currentSong", "playing", "currentIndex", 'mode', 'sequenceList'])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (newSong.id === oldSong.id) return;
      getSongUrl(this.currentSong.mid).then(this.play).catch(this.ready)
    },
    playing(newPlaying) {
      if (!this.songReady) return;
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  created() {
    this.middleTouchInitated();
  },
  methods: {
    onProgressBarChange(percent) {
      const currentTime = this.currentSong.duration * percent;
      //设置歌曲当前时间
      this.songReady = false;
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlay();
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    playScreen() {
      this.setFullScreen(!this.fullScreen);
    },
    paused() {
      this.setPlayingState(false)
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
    },
    play(url) {
      if (url) {
        this.songUrl = url.mp3_h;
      }
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
      if (this.songUrl) {
        setTimeout(() => {
          this.$refs.audio.play();
          this.getLyric();
        }, 1e3);
      }
    },
    ready() {
      this.songReady = true;
    },
    error() {
      this.songReady = true;
    },
    ended() {
      //歌曲播放结束
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next();
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play()
      this.setPlayingState(true)
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    togglePlay() {
      if (!this.songReady) return;
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
      this.setPlayingState(!this.playing);
    },
    next() {
      if (!this.songReady) return;
      //只有一首歌和模式为循环就循环播放
      if (this.playList.length === 1 && this.mode === playMode.loop) return this.loop();
      let index = this.currentIndex + 1;
      if (index === this.playList.length) {
        index = 0;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlay()
      }
      this.songReady = false;
    },
    prev() {
      if (!this.songReady) return;
      //只有一首歌和模式为循环就循环播放
      if (this.playList.length === 1 && this.mode === playMode.loop) return this.loop();
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playList.length - 1;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlay()
      }
      this.songReady = false;
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();

      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 800, // 持续时间
          easing: "linear",
          delay: 0, // delay in milliseconds
          clearTransformsBeforeStart: true
        }
      });
      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter(el, done) {
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style.transition = "all .4s";
      this.$refs.cdWrapper.style[
        transform
      ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener("transitioned", done);
    },
    afterLeave(el, done) {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style[transform] = "";
    },
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale
      };
    },
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = [];
      if (mode === playMode.random) {
        list = shuffle(this.playList)
      } else {
        list = deepCopy(this.sequenceList);
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    getLyric() {
      if (!this.currentSong) return;
      //获取并解析歌词
      console.log(this.currentSong)
      this.currentSong.getLyric().then(lyric => {
        this.currentLyric = new Lyric(lyric, this.handleLyric);
        if (this.playing) {
          this.currentLyric.play();
        }
      }).catch(() => {
        this.currentLyric = null;
        this.playingLyric = '';
        this.currentLineNum = 0;
      })
    },
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      this.playingLyric = txt;
    },
    middleTouchInitated() {
      this.touch = {}
    },
    middleTouchStart(e) {
      this.touch.initated = true;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initated) return;
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;
      //检测竖向移动距离大于横向 则不反应
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = 0;
      this.$refs.middlel.style.opacity = 1 - this.touch.percent;
    },
    middleTouchEnd(e) {
      if (!this.touch.initated) return;
      let offsetWidth = 0;
      let opacity = 0;
      if (this.currentShow === 'cd') {
        if (this.touch.percent > this.touchPercent) {
          offsetWidth = -window.innerWidth;
          this.currentShow = 'lyric';
          opacity = 0;
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        if (this.touch.percent < (1 - this.touchPercent)) {
          offsetWidth = 0;
          this.currentShow = 'cd';
          opacity = 1;
        } else {
          offsetWidth = - window.innerWidth;
          opacity = 0;
        }
      }
      const time = 300;
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;

      this.$refs.middlel.style.opacity = opacity;
      this.$refs.middlel.style[transitionDuration] = `${time}ms`;
      this.middleTouchInitated();
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAY_LIST"
    })
  },
  filters: {
    formate(interval) {
      interval = interval | 0;
      const minute = interval / 60 | 0;
      const second = interval % 60;
      return `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
    },
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  }
};
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
        }
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
            .title {
                width: 70%;
                margin: 0 auto;
                line-height: 40px;
                text-align: center;
                .no-wrap;
                font-size: @font-size-large;
                color: @color-text;
            }
            .subtitle {
                line-height: 20px;
                text-align: center;
                font-size: @font-size-medium;
                color: @color-text;
            }
        }
        .middle {
            position: fixed;
            width: 100%;
            top: 80px;
            bottom: 170px;
            white-space: nowrap;
            font-size: 0;
            .middle-l {
                display: inline-block;
                vertical-align: top;
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 80%;
                .cd-wrapper {
                    position: absolute;
                    left: 10%;
                    top: 0;
                    width: 80%;
                    box-sizing: border-box;
                    height: 100%;
                    .cd {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        .image {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            box-sizing: border-box;
                            border-radius: 50%;
                            border: 10px solid rgba(255, 255, 255, 0.1);
                        }
                        &.play {
                            animation: rotate 20s linear infinite;
                        }
                        &.paused {
                            animation-play-state: paused;
                        }
                    }
                }
                .playing-lyric-wrapper {
                    width: 80%;
                    margin: 30px auto 0 auto;
                    overflow: hidden;
                    text-align: center;
                    .playing-lyric {
                        height: 20px;
                        line-height: 20px;
                        font-size: @font-size-medium;
                        color: @color-text-ll;
                    }
                }
            }
            .middle-r {
                display: inline-block;
                vertical-align: top;
                width: 100%;
                height: 100%;
                overflow: hidden;
                .lyric-wrapper {
                    width: 80%;
                    margin: 0 auto;
                    overflow: hidden;
                    text-align: center;
                    .text {
                        line-height: 32px;
                        color: @color-text-l;
                        font-size: @font-size-medium;
                        &.current {
                            color: @color-text;
                        }
                    }
                    .pure-music {
                        padding-top: 50%;
                        line-height: 32px;
                        color: @color-text-l;
                        font-size: @font-size-medium;
                    }
                }
            }
        }
        .bottom {
            position: absolute;
            bottom: 50px;
            width: 100%;
            .dot-wrapper {
                text-align: center;
                font-size: 0;
                .dot {
                    display: inline-block;
                    vertical-align: middle;
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
            .progress-wrapper {
                display: flex;
                align-items: center;
                width: 80%;
                margin: 0 auto;
                padding: 10px 0;
                .time {
                    color: @color-text;
                    font-size: @font-size-small;
                    flex: 0 0 30px;
                    line-height: 30px;
                    width: 30px;
                    &.time-l {
                        text-align: left;
                    }
                    &.time-r {
                        text-align: right;
                    }
                }
                .progress-bar-wrapper {
                    flex: 1;
                }
            }
            .operators {
                display: flex;
                align-items: center;
                .icon {
                    flex: 1;
                    color: @color-theme;
                    &.disable {
                        color: @color-theme-d;
                    }
                    i {
                        font-size: 30px;
                    }
                }
                .i-left {
                    text-align: right;
                }
                .i-center {
                    padding: 0 20px;
                    text-align: center;
                    i {
                        font-size: 40px;
                    }
                }
                .i-right {
                    text-align: left;
                }
                .icon-favorite {
                    color: @color-sub-theme;
                }
            }
        }
        &.normal-enter-active,
        &.normal-leave-active {
            transition: all 0.4s;
            .top,
            .bottom {
                transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
            }
        }
        &.normal-enter,
        &.normal-leave-to {
            opacity: 0;
            z-index: -10;
            .top {
                transform: translate3d(0, -100px, 0);
            }
            .bottom {
                transform: translate3d(0, 100px, 0);
            }
        }
    }
    .mini-player {
        display: flex;
        align-items: center;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 180;
        width: 100%;
        height: 60px;
        background: @color-highlight-background;
        &.mini-enter-active,
        &.mini-leave-active {
            transition: all 0.4s;
        }
        &.mini-enter,
        &.mini-leave-to {
            opacity: 0;
        }
        .icon {
            flex: 0 0 40px;
            width: 40px;
            height: 40px;
            padding: 0 10px 0 20px;
            .imgWrapper {
                height: 100%;
                width: 100%;
                img {
                    border-radius: 50%;
                    &.play {
                        animation: rotate 10s linear infinite;
                    }
                    &.paused {
                        animation-play-state: paused;
                    }
                }
            }
        }
        .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            .name {
                margin-bottom: 2px;
                .no-wrap;
                font-size: @font-size-medium;
                color: @color-text;
            }
            .desc {
                .no-wrap;
                font-size: @font-size-small;
                color: @color-text-d;
            }
        }
        .control {
            flex: 0 0 30px;
            width: 30px;
            padding: 0 10px;
            .icon-play-mini,
            .icon-pause-mini,
            .icon-playlist {
                font-size: 30px;
                color: @color-theme-d;
            }
            .icon-mini {
                font-size: 32px;
                position: absolute;
                left: 0;
                top: 0;
            }
        }
    }
}

@keyframes rotate {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
