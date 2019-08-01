import request from '@/utils/request'
// 冷柜
export function listCold(data) {
  return request({
    url: '/cold/list',
    method: 'post',
    data
  })
}

export function createCold(data) {
  return request({
    url: '/cold/add',
    method: 'post',
    data
  })
}

export function updateCold(data) {
  return request({
    url: '/cold/edit',
    method: 'post',
    data
  })
}

export function deleteCold(query) {
  return request({
    url: '/cold/del',
    method: 'get',
    params: query
  })
}

// 悼念厅
export function listmourn(data) {
  return request({
    url: '/mourn/list',
    method: 'post',
    data
  })
}

export function createmourn(data) {
  return request({
    url: '/mourn/add',
    method: 'post',
    data
  })
}

export function updatemourn(data) {
  return request({
    url: '/mourn/edit',
    method: 'post',
    data
  })
}

export function deletemourn(query) {
  return request({
    url: '/mourn/del',
    method: 'get',
    params: query
  })
}

// 车辆
export function listcar(data) {
  return request({
    url: '/car/list',
    method: 'post',
    data
  })
}

export function createcar(data) {
  return request({
    url: '/car/add',
    method: 'post',
    data
  })
}

export function updatecar(data) {
  return request({
    url: '/car/edit',
    method: 'post',
    data
  })
}

export function deletecar(query) {
  return request({
    url: '/car/del',
    method: 'get',
    params: query
  })
}

// 系统配置
export function listconfig(data) {
  return request({
    url: '/config/list',
    method: 'post',
    data
  })
}

export function createconfig(data) {
  return request({
    url: '/config/add',
    method: 'post',
    data
  })
}

export function updateconfig(data) {
  return request({
    url: '/config/edit',
    method: 'post',
    data
  })
}

export function deleteconfig(query) {
  return request({
    url: '/config/del',
    method: 'get',
    params: query
  })
}

export function getconfig(query) {
  return request({
    url: '/config/common',
    method: 'get',
    params: query
  })
}

// 服务管理
export function listservices(data) {
  return request({
    url: '/services/list',
    method: 'post',
    data
  })
}

export function createservices(data) {
  return request({
    url: '/services/add',
    method: 'post',
    data
  })
}

export function updateservices(data) {
  return request({
    url: '/services/edit',
    method: 'post',
    data
  })
}

export function deleteservices(query) {
  return request({
    url: '/services/del',
    method: 'get',
    params: query
  })
}

export function getservices(query) {
  return request({
    url: '/services/common',
    method: 'get',
    params: query
  })
}

// 丧葬用品管理
export function listsupplies(data) {
  return request({
    url: '/supplies/list',
    method: 'post',
    data
  })
}

export function createsupplies(data) {
  return request({
    url: '/supplies/add',
    method: 'post',
    data
  })
}

export function updatesupplies(data) {
  return request({
    url: '/supplies/edit',
    method: 'post',
    data
  })
}

export function deletesupplies(query) {
  return request({
    url: '/supplies/del',
    method: 'get',
    params: query
  })
}

export function storage(query) {
  return request({
    url: '/supplies/storage',
    method: 'get',
    params: query
  })
}
// 服务套餐
export function listcombo(data) {
  return request({
    url: '/servicesCombo/list',
    method: 'post',
    data
  })
}

export function createcombo(data) {
  return request({
    url: '/servicesCombo/add',
    method: 'post',
    data
  })
}

export function updatecombo(data) {
  return request({
    url: '/servicesCombo/edit',
    method: 'post',
    data
  })
}

export function deletecombo(query) {
  return request({
    url: '/servicesCombo/del',
    method: 'get',
    params: query
  })
}
export function CommonCombo(query) {
  return request({
    url: '/servicesCombo/common',
    method: 'get',
    params: query
  })
}

