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
// export function createcarcommon(data) {
//   return request({
//     url: '/carsend/common',
//     method: 'post',
//     data
//   })
// }

// export function updatecombo(data) {
//     return request({
//         url: '/servicesCombo/edit',
//         method: 'post',
//         data
//     })
// }

// export function deletecombo(query) {
//     return request({
//         url: '/servicesCombo/del',
//         method: 'get',
//         params: query
//     })
// }
