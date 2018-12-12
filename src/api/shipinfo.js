import request from '@/utils/request'

// 船只定义信息拉取（全部）
export function getAllShipDefInfo() {
  return request({
    url: '/shipDef/getAllShipDef',
    method: 'get'
  })
}

// 船只详细信息拉取（全部）
export function getAllShipInfo() {
  return request({
    url: '/shipInfo/getAllShipInfo',
    method: 'get'
  })
}

// 船只详细信息拉取（单一）
export function getOneShipInfo(shipId) {
  return request({
    url: '/shipInfo/getOneShipById',
    method: 'get',
    params: { shipId }
  })
}
// 船只详细信息获取（单一）时间段内
export function getOneShipInfoByTimeBetween(shipId, startTime, endTime) {
  return request({
    url: '/shipInfo/getAllByIdTimeBetween',
    method: 'get',
    params: { shipId, startTime, endTime }
  })
}
