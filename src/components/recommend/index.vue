<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :list="discList">
      <div>
        <div v-if="recommends.length" class="recommend-slider">
          <div class="recommend-slider_wrapper">
            <div class="recommend-slider_content">
              <slider ref="slider">
                <div v-for="item in recommends" :key="item.id">
                  <a class="needsclick" :href="item.linkUrl">
                    <img @load="loadImage" :src="item.picUrl" alt="">
                  </a>
                </div>
              </slider>
            </div>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="recommend-list_title">热门歌单推荐</h1>
          <ul class="recommend-list_ul">
            <li @click="selectItem(item)" class="recommend-list_li" v-for="(item,index) in discList" :key="index">
              <div class="recommend-list_icon">
                <img class="recommend-list_img" v-lazy="item.imgurl" width="60" height="60" alt="">
              </div>
              <div class="recommend-list_text">
                <h2 class="recommend-list_name" v-html="item.creator.name"></h2>
                <p class="recommend-list_desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="recommend-loading" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from "@/api/recommend";
import { ERR_OK } from "@/api/config";
import Slider from "@/base/slider";
import Scroll from "@/base/scroll";
import Loading from "@/base/loading";
import { playListMixin } from "@/assets/js/mixin";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      recommends: [],
      discList: []
    };
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    handlePlayList(playList, miniHeight) {
      this.$refs.recommend.style.bottom = playList.length > 0 ? `${miniHeight}px` : '';
      this.$refs.scroll.refresh();
    },
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        }
      });
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (!res.code) {
          this.discList = res.data.list;
        }
      });
    },
    loadImage() {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }
    },
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setDisc(item);
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
};
</script>

<style lang="less">
@import "~assets/less/variable.less";

.recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    &-content {
        height: 100%;
        overflow: hidden;
    }
    &-slider {
        &_wrapper {
            position: relative;
            width: 100%;
            height: 0;
            padding-top: 40%;
            overflow: hidden;
        }
        &_content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }
    &-list {
        &_title {
            height: 65px;
            line-height: 65px;
            text-align: center;
            font-size: @font-size-medium;
            color: @color-theme;
        }
        &_li {
            display: flex;
            flex-flow: row nowrap;
            box-sizing: border-box;
            align-items: center;
            padding: 0 20px 20px 20px;
        }
        &_icon {
            flex: 0 0 60px;
            width: 60px;
            padding-right: 20px;
        }
        &_text {
            display: flex;
            flex-flow: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            font-size: @font-size-medium;
        }
        &_img {
            display: block;
        }
        &_name {
            margin-bottom: 10px;
            color: @color-text;
        }
        &_desc {
            color: @color-text-d;
        }
    }
    &-loading {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
}
</style>
