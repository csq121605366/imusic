
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