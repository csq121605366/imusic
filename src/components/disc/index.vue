<template>
  <transition name="slide">
    <music-list :title="title" :songs="songs" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script>
import MusicList from "@/components/music-list";
import { mapGetters } from "vuex";
import { getDisc } from "@/api/recommend";
import { ERR_OK } from "@/api/config";
import { createSong } from "@/assets/js/song"
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.disc.dissname;
    },
    bgImage() {
      return this.disc.imgurl;
    },
    ...mapGetters(['disc'])
  },
  created() {
    this._getDisc();
  },
  methods: {
    _getDisc() {
      if (!this.disc) return;
      getDisc(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      });
      return ret;
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="less">
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
    transform: translate3d(100%, 0, 0);
}
</style>
