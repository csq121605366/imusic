<template>
  <transition name="slide" enter-active-class="animated fadeInRight" leave-active-class="animated bounceOutRight">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getSingerDetail } from "@/api/singer";
import { createSong } from "@/api/song";
import { ERR_OK } from "@/api/config";
import MusicList from "components/music-list";

export default {
  data() {
    return {
      songs: []
    };
  },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    ...mapGetters(["singer"])
  },
  methods: {
    _getDetail() {
      let mid = this.singer.id;
      if (!mid) {
        mid = this.$route.params.mid;
      }
      getSingerDetail(mid).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normailzeSongs(res.data.list);
        } else {
          this.$router.push("/singer");
        }
      });
    },
    _normailzeSongs(list) {
      let ret = [];
      list.forEach(item => {
        let { musicData } = item;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },
  created() {
    this._getDetail();
  },
  components: {
    MusicList
  }
};
</script>

<style lang="less">
.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
