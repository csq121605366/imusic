export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)?' + className + '(\\s|$)?')
  return reg.test(el.className)
}

/**
 * dom元素上获取和设置参数
 * @param {dom} el dom元素
 * @param {*} name 参数名称如 data-index中的index
 * @param {*} val 如果存在值就是设置，不存在就是获取
 */
export function getData(el, name, val) {
  const prefix = 'data-';
  const dataName = prefix + name;
  if (val) {
    return el.setAttribute(dataName, val);
  } else {
    return el.getAttribute(dataName);
  }
}


let elementStyle = document.createElement('div').style;
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: "OTransform",
    ms: "msTransform",
    standard: 'tranform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false;
})()

export function prefixStyle(style) {
  if (!vendor) return false;
  if (vendor === 'standard') return style;
  return `${vendor}${style.charAt(0).toUpperCase()+style.substr(1)}`
}
