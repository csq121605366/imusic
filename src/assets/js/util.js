
export function deepCopy(obj) {
  let newObj = obj.constructor === Array ? [] : {};
  if (typeof obj !== "object") {
    return;
  }
  if (window.JSON) {
    newObj = JSON.parse(JSON.stringify(obj));
  } else {
    for (let i in obj) {
      newObj[i] = typeof obj[i] === "object" ? deepCopy(obj[i]) : obj[i];
    }
  }
  return newObj;
}