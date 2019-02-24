import {
  getLyric
} from "@/api/song";
import {
  ERR_OK
} from "@/api/config";
import {
  Base64
} from './util';

export default class Song {
  constructor({
    id,
    mid,
    singer,
    name,
    album,
    duration,
    image,
    url
  }) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }

  getLyric() {
    return new Promise((resolve, reject) => {
      if (this.lyric) {
        return resolve(this.lyric);
      }
      getLyric(this.mid).then(res => {
        if (res.retcode === ERR_OK) {
          this.lyric = new Base64().decode(res.lyric);
          return resolve(this.lyric)
        } else {
          return reject('no lyric');
        }
      })
    })
  }

}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
  })
}



function filterSinger(singer) {
  let ret = [];
  if (!singer) return '';
  singer.forEach(element => {
    ret.push(element.name);
  });
  return ret.join('/');
}
