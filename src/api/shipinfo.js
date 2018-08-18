import request from '@/utils/request'

// 数据拉取
export function getAllShipInfo() {
  return request({
    url: '/shipInfo/getAllShipInfo',
    method: 'get'
  })
}

