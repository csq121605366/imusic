import originJSONP from 'jsonp'

// 将jsonp返回方式变为promise 并且将url和上传参数分开
export default function jsonp(url, data, option) {
  // 首先检测url最后是否有“？” 如果没有则增加“？” 如果有就直接拼接参数
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    })
  })
}

function param(data) {
  let url = ''
  for (let k in data) {
    let value = data[k] || ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  // 除去url拼接的第一个&符号
  return url ? url.substring(1) : ''
}