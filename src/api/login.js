import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

// url: '/auth/getInfor',
// method: 'get',
// params: {}
export function getUserInfo() {
  return request({
    url: '/auth/getInfor',
    method: 'get'
  })
}
