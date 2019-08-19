import request from '@/utils/request'
// 统计
export function statscheck(data) {
  return request({
    url: '/statistics/check',
    method: 'post',
    data
  })
}
export function statscarsend(data) {
  return request({
    url: '/statistics/carsend',
    method: 'post',
    data
  })
}
export function statsobituary(data) {
  return request({
    url: '/statistics/obituary',
    method: 'post',
    data
  })
}
export function statscarmonth(data) {
  return request({
    url: '/statistics/carmonth',
    method: 'post',
    data
  })
}
export function statderate(data) {
  return request({
    url: '/statistics/derate',
    method: 'post',
    data
  })
}

export function statsunknown(data) {
  return request({
    url: '/statistics/unknown',
    method: 'post',
    data
  })
}
export function statservices(data) {
  return request({
    url: '/statistics/services',
    method: 'post',
    data
  })
}
export function statsupplies(data) {
  return request({
    url: '/statistics/supplies',
    method: 'post',
    data
  })
}
export function statswreath(data) {
  return request({
    url: '/statistics/wreath',
    method: 'post',
    data
  })
}
export function statswreathList(data) {
  return request({
    url: '/statistics/wreathList',
    method: 'post',
    data
  })
}
