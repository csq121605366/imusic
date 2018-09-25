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



}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
    url:`http://dl.stream.qqmusic.qq.com/M800003SeXGZ1JUtaX.mp3?guid=2095717240&vkey=4585C3C4D07D584697B446B54082927AD2FFBA4328C3072FEB5C74714FD11AD48D6A62F493D5F014FA05F0E5038E2132B27CF231471BCE07&uin=0&fromtag=53`
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
