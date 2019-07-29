import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/token/app',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/manager/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function changePassword(data) {
  return request({
    url: '/manager/edit_pwd',
    method: 'post',
    data
  })
}
