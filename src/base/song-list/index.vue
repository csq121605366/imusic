<template>
  <div class="song-list">
    <ul>
      <li @click.stop="selectItem(song,index)" v-for="(song,index) in songs" :key="index" class="item">
        <div class="content">
          <div class="name">{{song.name}}</div>
          <div class="desc">{{getDesc(song)}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default: []
    }
  },
  async mounted() {},
  methods: {
    getDesc(song) {
      return `${song.singer} 。${song.album}`;
    },
    selectItem(song, index) {
      this.$emit("select", { song, index });
    }
  }
};
</script>

<style scoped lang="less">
@import "~assets/less/variable.less";
@import "~assets/less/mixin.less";

.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: @font-size-medium;
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        .no-wrap;
        color: @color-text;
      }
      .desc {
        .no-wrap;
        margin-top: 4px;
        color: @color-text-d;
      }
    }
  }
}
</style>
