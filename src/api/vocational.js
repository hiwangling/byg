import request from '@/utils/request'
// 业务办理
export function getobituary(query) {
  return request({
    url: '/obituary/common',
    method: 'get',
    params: query
  })
}
export function listobituary(data) {
  return request({
    url: '/obituary/list',
    method: 'post',
    data
  })
}
export function getserver(query) {
  return request({
    url: '/servicescombo/services',
    method: 'get',
    params: query
  })
}
