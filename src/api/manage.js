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
export function editobituary(data) {
  return request({
    url: '/obituary/edit',
    method: 'post',
    data
  })
}


export function delobituary(query) {
  return request({
    url: '/obituary/del',
    method: 'get',
    params: query
  })
}

//火化办理

export function listfire(data) {
  return request({
    url: '/cremation/list',
    method: 'post',
    data
  })
}
export function editfire(data) {
  return request({
    url: '/cremation/edit',
    method: 'post',
    data
  })
}
export function commonCremation(query) {
  return request({
    url: '/cremation/common',
    method: 'get',
    params: query
  })
}
export function infoCremation(query) {
  return request({
    url: '/cremation/info',
    method: 'get',
    params: query
  })
}
export function signfire(data) {
  return request({
    url: '/cremation/sign',
    method: 'post',
    data
  })
}
export function statefire(data) {
  return request({
    url: '/cremation/state',
    method: 'post',
    data
  })
}
 