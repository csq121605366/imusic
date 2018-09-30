import * as types from './mutation-type';

export const selectPlay = function ({
  commit,
  state
}, {
  list,
  index
}) {
  commit(types.SET_SEQUENCE_LIST, list); //设置原始播放列表
  commit(types.SET_PLAY_LIST, list); //设置播放列表
  commit(types.SET_CURRENT_INDEX, index); //设置当前索引
  commit(types.SET_FULL_SCREEN, true); //设置是否全屏
  commit(types.SET_PLAYING_STATE, true); //设置播放状态
}
