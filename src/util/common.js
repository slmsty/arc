/**
 * 获取字符串长度
 * @param val
 * @returns {number}
 */
export default function getByteLen(val) {
  var len = 0;
  for (var i = 0; i < val.length; i++) {
    var a = val.charAt(i);
    if (a.match(/[^\x00-\xff]/ig) != null) {
      len += 2;
    }
    else {
      len += 1;
    }
  }
  return len;
}

/**
 * 校验邮箱格式
 * @param email
 * @returns {boolean}
 */
export function checkEmail(email) {
  const mailRex = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.|\-]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  if(!mailRex.test(email)){
    return false
  }
  return true
}

/**
 * 获取当月第一天
 * @returns {number}
 */
export function getCurrentMonthFirst() {
  let date = new Date()
  const firstDay = date.setDate(1)
  return new Date(firstDay)
}

/**
 * 获取当月最后一天
 */
export function getCurrentMonthLast() {
  let date = new Date()
  const nextMonth = date.getMonth() + 1
  const nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
  return new Date(nextMonthFirstDay - 1000 * 60 * 60 * 24)
}
