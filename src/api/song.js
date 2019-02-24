import axios from 'axios'
import jsonp from 'assets/js/jsonp';
import {
  commonParams,
  options
} from './config';
import Qs from 'qs'




export function getSongUrl(mid) {
  return new Promise((resolve, reject) => {
    const url = "/douqq/getSongUrl";
    var data = Qs.stringify({
      "mid": mid
    });
    return axios.post(url, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((res) => {
      if (res && res.data) {
        try {
          return resolve(JSON.parse(res.data))
        } catch (error) {
          return reject([])
        }
      }
    }).catch(error => {
      return reject([])
    })
  })
}

export function getLyric(mid) {
  const url = '/api/lyric';
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +Date.now(),
    platform: "yqq",
    hostUin: 0,
    needNewCode: 0,
    g_tk: 67232076,
    formate: "json"
  })
  return jsonp(url, data, options);
}
