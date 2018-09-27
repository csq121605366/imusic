import {
  playMode
} from '@/assets/js/config';

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [], //歌曲列表
  sequenceList: [], //顺序列表
  mode: playMode.sequence, //播放模式
  currentIndex: -1, //当前播放索引
}

export default state;
