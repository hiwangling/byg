export default function checkdate(date) {
  var cn = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  var arr = []
  var YY = date.getFullYear().toString()
  for (var i = 0; i < YY.length; i++) {
    if (cn[YY.charAt(i)]) {
      arr.push(cn[YY.charAt(i)])
    }
  }
  arr.push('年')
  var MM = date.getMonth() + 1
  if (MM < 10) {
    arr.push(cn[MM])
  } else if (MM < 20) {
    arr.push('十' + cn[MM % 10])
  }
  arr.push('月')
  var DD = date.getDate()
  if (DD < 10) {
    arr.push(cn[DD])
  } else if (DD < 20) {
    arr.push('十' + cn[DD % 10])
  } else {
    arr.push('二十' + cn[DD % 10])
  }
  arr.push('日')
  return arr.join('')
}
