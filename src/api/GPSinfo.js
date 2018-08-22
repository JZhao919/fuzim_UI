import request from '@/utils/request'

// 获取所有游船当前最新GPS信息
export function getAllNowGPS() {
  return request({
    url: '/gps/getAllNowGPS',
    method: 'get'
  })
}

// 根据游船编号获取游船最新GPS信息
export function getOneNowGPSById(shipId) {
  return request({
    url: '/gps/getOneNowGPSById',
    method: 'get',
    params: { shipId }
  })
}

// 获取指定船只（shipId）的指定时刻后的全部GPS信息
export function getAllGPSByIdTime(shipId, startTime) {
  return request({
    url: '/gps/getAllGPSByIdTime',
    method: 'get',
    params: { shipId, startTime }
  })
}

// 获取指定船只（shipId）的指定时间段内的GPS信息
export function getAllGPSByIdTimeBetween(shipId, startTime, endTime) {
  return request({
    url: '/gps/getAllGPSByIdTimeBetween',
    method: 'get',
    params: { shipId, startTime, endTime }
  })
}

// 指定时间后的所有船只GPS信息
export function getAllGPSByTime(time) {
  return request({
    url: '/gps/getAllGPSByTime',
    method: 'get',
    params: { time }
  })
}

// 指定时间段内的所有船只GPS信息
export function getAllGPSByTimeBetween(startTime, endTime) {
  return request({
    url: '/gps/getAllGPSByTimeBetween',
    method: 'get',
    params: { startTime, endTime }
  })
}
