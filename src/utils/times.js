/* eslint-disable */ 
/**
 * 时间格式化函数-日期转换成字符串
 * @param {Date} datetime
 * @return number datetime yyyyMMddHHmmss
 */
export function dateToInt(datetime) {
  datetime = new Date(datetime)
  var year = datetime.getFullYear()
  var month = datetime.getMonth() + 1 // js从0开始取
  var date = datetime.getDate()
  var hour = datetime.getHours()
  var minutes = datetime.getMinutes()
  var second = datetime.getSeconds()
  year = String(year)
  String(month).length < 2 ? month = '0' + month : month
  String(date).length < 2 ? date = '0' + date : date
  String(hour).length < 2 ? hour = '0' + hour : hour
  String(minutes).length < 2 ? minutes = '0' + minutes : minutes
  String(second).length < 2 ? second = '0' + second : second
  var time = year + month + date + hour + minutes + second // '20090612171805'
  return parseInt(time)
}
/**
 * 时间格式化函数-字符串转换成日期
 * @param number datetime yyyyMMddHHmmss
 * @return {Date} datetime
 */
export function intToDate(datetime) {
  datetime = String(datetime) // 转成字符串
  var year = datetime.substr(0, 4)
  var month = datetime.substr(4, 2)
  var day = datetime.substr(6, 2)
  var hour = datetime.substr(8, 2)
  var minute = datetime.substr(10, 2)
  var second = datetime.substr(12, 2)
  var date = String(year) + '-' + String(month) + '-' + String(day) + ' ' + String(hour) + ':' + String(minute) + ':' + String(second)
  return new Date(date)
}
/**
 * @param {timestamps} timestamps 时间差
 * @return String example '1小时1分钟1秒'
 */
export function timestampsToTime(timestamps) {
  var secondTime =  parseInt(timestamps) / 1000 //时间差秒级
  // console.log('时间戳的时间差(s):' + secondTime)
  if(secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
    var minuteTime = parseInt(secondTime / 60) // 获取分钟，除以60取整数，得到整数分钟
    var secondTime = parseInt(secondTime % 60) // 获取秒数，秒数取佘，得到整数秒数
    var result = minuteTime + '分钟' + secondTime + '秒'
    if(minuteTime > 60) { // 如果分钟大于60，将分钟转换成小时
      var hourTime = parseInt(minuteTime / 60)  // 获取小时，获取分钟除以60，得到整数小时
      var minuteTime = parseInt(minuteTime % 60) // 获取小时后取佘的分，获取分钟除以60取佘的分
      result = hourTime + '小时' + minuteTime + '分钟' + secondTime + '秒'
    }
    return result
  }
  return betweenTime + "秒"
}






