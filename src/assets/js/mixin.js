import {
  mapGetters
} from 'vuex';

export const playListMixin = {
  data() {
    return {
      miniHeight: 60
    }
  },
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(this.playList, this.miniHeight)
    }
  },
  mounted() {
    this.handlePlayList(this.playList, this.miniHeight)
  },
  activated() {
    this.handlePlayList(this.playList, this.miniHeight)
  },
  methods: {
    handlePlayList(list, height) {
      throw new Error('component must implement handlePlayList method');
    }
  }
}
