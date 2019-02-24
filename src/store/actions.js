import * as types from './mutation-type';
import {
  deepCopy,
  shuffle,
  findSongsIndex
} from '@/assets/js/util';
import {
  playMode
} from "@/assets/js/config";

export const selectPlay = function ({
  commit,
  state
}, {
  list,
  index
}) {
  commit(types.SET_SEQUENCE_LIST, deepCopy(list)); //设置原始播放列表
  if (state.mode === playMode.random) {
    let shuffleList = shuffle(list);
    commit(types.SET_PLAY_LIST, shuffleList); //设置播放列表
    index = findSongsIndex(shuffleList, list[index]);
  } else {
    commit(types.SET_PLAY_LIST, list); //设置播放列表
  }
  commit(types.SET_CURRENT_INDEX, index); //设置当前索引
  commit(types.SET_FULL_SCREEN, true); //设置是否全屏
  commit(types.SET_PLAYING_STATE, true); //设置播放状态
}


export const randomPlay = function ({
  commit,
  state
}, {
  list
}) {
  //随机播放
  commit(types.SET_PLAY_MODE, playMode.random); //设置播放状态
  commit(types.SET_SEQUENCE_LIST, deepCopy(list)); //设置播放列表
  commit(types.SET_PLAY_LIST, shuffle(list)); //改变播放列表
  commit(types.SET_CURRENT_INDEX, 0); //当前播放index
  commit(types.SET_FULL_SCREEN, true); //是否全屏
  commit(types.SET_PLAYING_STATE, true); //设置播放状态
}
