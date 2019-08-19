/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const settingRouter = {
  path: '/setting',
  component: Layout,
  alwaysShow: true,
  name: 'VueSetting',
  meta: { title: '基础配置', icon: 'component' },
  children: [
    {
      path: '/mourn',
      name: 'Vuemourn',
      component: () => import('@/views/setting/mourn'),
      meta: {
        title: '悼念厅管理',
        noCache: true,
        perms: ['POST /api/v1/manager/list', 'POST /api/v1/manager/add', 'POST /api/v1/manager/edit']
      }
    },
    {
      path: '/cold',
      name: 'Vuecold',
      component: () => import('@/views/setting/cold'),
      meta: {
        title: '冷柜管理',
        noCache: true,
        perms: ['POST /api/v1/branch/list', 'GET /api/v1/branch/del', 'POST /api/v1/branch/add', 'POST /api/v1/branch/edit', 'POST /api/v1/auth_rule/all']
      }
    },
    {
      path: '/car',
      name: 'Vuecar',
      component: () => import('@/views/setting/car'),
      meta: {
        title: '车辆管理',
        noCache: true,
        perms: ['POST /api/v1/manager/list', 'POST /api/v1/manager/add', 'POST /api/v1/manager/edit']
      }
    },
    {
      path: '/services',
      name: 'Vueservices',
      component: () => import('@/views/setting/services'),
      meta: {
        title: '服务管理',
        noCache: true,
        perms: ['POST /api/v1/manager/list', 'POST /api/v1/manager/add', 'POST /api/v1/manager/edit']
      }
    },
    {
      path: '/combo',
      name: 'Vuecombo',
      component: () => import('@/views/setting/combo'),
      meta: {
        title: '套餐管理',
        noCache: true,
        perms: ['POST /api/v1/manager/list', 'POST /api/v1/manager/add', 'POST /api/v1/manager/edit']
      }
    },
    {
      path: '/supplies',
      name: 'Vuesupplies',
      component: () => import('@/views/setting/supplies'),
      meta: {
        title: '丧葬用品',
        noCache: true,
        perms: ['POST /api/v1/manager/list', 'POST /api/v1/manager/add', 'POST /api/v1/manager/edit']
      }
    },
    {
      path: '/wreath',
      name: 'Vuewreath',
      component: () => import('@/views/setting/wreath'),
      meta: {
        title: '花圈挽联',
        noCache: true,
        perms: ['POST /api/v1/manager/list', 'POST /api/v1/manager/add', 'POST /api/v1/manager/edit']
      }
    }, {
      path: '/config',
      name: 'Vueconfig',
      component: () => import('@/views/setting/config'),
      meta: {
        title: '系统配置',
        noCache: true,
        perms: ['POST /api/v1/manager/list', 'POST /api/v1/manager/add', 'POST /api/v1/manager/edit']
      }
    }
  ]
}
export default settingRouter
