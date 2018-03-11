<template>
  <div class="singer">
    <list-view :list="singers"></list-view>
  </div>
</template>

<script>
import { getSingerList } from "@/api/singer";
import { ERR_OK } from "@/api/config";
import Singer from "@/assets/js/singer";
import ListView from "@/base/listview";
export default {
  data() {
    return {
      singers: [],
      hotCount: 10,
      hotTitle: "热门",
      map: []
    };
  },
  created() {
    this._getSingerList();
  },
  methods: {
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list);
        }
      });
    },
    _normalizeSinger(list) {
      /*  map的数据类型如下
      {
        hot:{title: "热门",count: 10,items: []},
        ret:[
          {title: "A",count: 10,items: []},
          ...
        ]
      } */
      let map = {
        hot: {
          title: "热门",
          count: 10,
          items: []
        }
      };
      for (let i = "A".charCodeAt(0); i <= "Z".charCodeAt(0); i++) {
        map[String.fromCharCode(i)] = {
          count: 0,
          title: String.fromCharCode(i),
          items: []
        };
      }
      Array.from(list, (el, index) => {
        if (!/[a-zA-Z]/g.test(el.Findex)) {
          return;
        }
        // 存储前十个热门歌手
        if (index < map.hot.count) {
          map.hot.items.push(
            new Singer({
              mid: el.Fsinger_mid,
              name: el.Fsinger_name
            })
          );
        }
        map[el.Findex].count += 1;
        map[el.Findex].items.push(
          new Singer({
            mid: el.Fsinger_mid,
            name: el.Fsinger_name
          })
        );
      });
      // 处理map得到有序列表
      let hot = [];
      let ret = [];

      for (let i in map) {
        if (/[a-zA-Z]{1}/.test(map[i].title)) {
          ret.push(map[i]);
        } else {
          hot.push(map[i]);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    }
  },
  components: {
    ListView
  }
};
</script>

<style lang="less">
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
