/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const statsRouter = {
  path: '/check',
  component: Layout,
  alwaysShow: true,
  name: 'VueSetting',
  meta: { title: '统计分析', icon: 'component' },
  children: [
    {
      path: '/stats/check',
      name: 'Vuecheck',
      component: () => import('@/views/stats/check'),
      meta: {
        title: '骨灰统计',
        noCache: true,
        perms: ['POST /api/v1/manager/list', 'POST /api/v1/manager/add', 'POST /api/v1/manager/edit']
      }
    },
    {
      path: '/stats/sends',
      name: 'Vuecarsend',
      component: () => import('@/views/stats/carsend'),
      meta: {
        title: '接运统计',
        noCache: true,
        perms: ['POST /api/v1/manager/list', 'POST /api/v1/manager/add', 'POST /api/v1/manager/edit']
      }
    },
    {
      path: '/stats/carmonth',
      name: 'Vuecarmonth',
      component: () => import('@/views/stats/carmonth'),
      meta: {
        title: '车队月统计',
        noCache: true,
        perms: ['POST /api/v1/manager/list', 'POST /api/v1/manager/add', 'POST /api/v1/manager/edit']
      }
    },
    {
      path: '/statistics/unknown',
      name: 'Vueounknown',
      component: () => import('@/views/stats/unknown'),
      meta: {
        title: '无名尸统计',
        noCache: true,
        perms: ['POST /api/v1/manager/list', 'POST /api/v1/manager/add', 'POST /api/v1/manager/edit']
      }
    },
    {
      path: '/statistics/derate',
      name: 'Vuederate',
      component: () => import('@/views/stats/derate'),
      meta: {
        title: '火化费救助',
        noCache: true,
        perms: ['POST /api/v1/manager/list', 'POST /api/v1/manager/add', 'POST /api/v1/manager/edit']
      }
    },
    {
      path: '/stats/obituary',
      name: 'Vueobituary',
      component: () => import('@/views/stats/obituary'),
      meta: {
        title: '完结业务统计',
        noCache: true,
        perms: ['POST /api/v1/manager/list', 'POST /api/v1/manager/add', 'POST /api/v1/manager/edit']
      }
    }
  ]
}
export default statsRouter
