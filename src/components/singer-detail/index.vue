<template>
  <transition name="slide" enter-active-class="animated tada" leave-active-class="animated bounceOutRight">
    <div class="singer-detail"></div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getSingerDetail } from "@/api/singer";
import { ERR_OK } from "@/api/config";
export default {
  computed: {
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
          console.log(res);
        } else {
          this.$router.push("/singer");
        }
        console.log(this.$store);
      });
    }
  },
  created() {
    this._getDetail();
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
