const filterSinger = Symbol('filterSinger');


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
    this.song = arguments[0];
  }

  createSong(musicData) {
    return new Song({
      id: musicData.id,
      mid: musicData.mid,
      singer: this[filterSinger](musicData.singer),
      name: musicData.name,
      album: musicData.album,
      duration: musicData.interval,
      image: musicData.image,
      url: musicData.url,
    })
  }

  [filterSinger](singer) {
    let res = [];
    if (!singer) {
      return ''
    }
    singer.forEach(i => {
      res.push(i);
    })
    return res.join('/')
  }

}
