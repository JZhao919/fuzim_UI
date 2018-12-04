/**
 * 时间格式化函数
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
