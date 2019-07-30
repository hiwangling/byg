import request from '@/utils/request'
// 服务套餐
export function listcarsend(data) {
  return request({
    url: '/carsend/list',
    method: 'post',
    data
  })
}

export function createcarsend(data) {
  return request({
    url: '/carsend/add',
    method: 'post',
    data
  })
}

export function editsend(data) {
  return request({
    url: '/carsend/edit',
    method: 'post',
    data
  })
}

export function createcarcommon(query) {
  return request({
    url: '/carsend/common',
    method: 'get',
    params: query
  })
}

export function editinfoService(query) {
  return request({
    url: '/carsend/editinfo',
    method: 'get',
    params: query
  })
}

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

export function addobituary(data) {
  return request({
    url: '/obituary/add',
    method: 'post',
    data
  })
}

export function infoobituary(query) {
  return request({
    url: '/obituary/info',
    method: 'get',
    params: query
  })
}
