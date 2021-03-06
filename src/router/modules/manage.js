/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const manageRouter = {
  path: '/manage',
  component: Layout,
  alwaysShow: true,
  name: 'Vuemanage',
  meta: { title: '接待中心', icon: 'list' },
  children: [
    {
      path: '/carsend',
      name: 'Vuecarsend',
      component: () => import('@/views/manage/carsend'),
      meta: {
        title: '接运管理',
        noCache: true,
        perms: ['POST /api/v1/branch/list', 'GET /api/v1/branch/del', 'POST /api/v1/branch/add', 'POST /api/v1/branch/edit', 'POST /api/v1/auth_rule/all']
      }
    },
    {
      path: '/vocational',
      name: 'Vuevocational',
      component: () => import('@/views/manage/vocational'),
      meta: {
        title: '业务办理',
        noCache: true,
        perms: ['POST /api/v1/branch/list', 'GET /api/v1/branch/del', 'POST /api/v1/branch/add', 'POST /api/v1/branch/edit', 'POST /api/v1/auth_rule/all']
      }
    },
    {
      path: '/fire',
      name: 'Vuefire',
      component: () => import('@/views/manage/fire'),
      meta: {
        title: '火化办理',
        noCache: true,
        perms: ['POST /api/v1/branch/list', 'GET /api/v1/branch/del', 'POST /api/v1/branch/add', 'POST /api/v1/branch/edit', 'POST /api/v1/auth_rule/all']
      }
    },
    {
      path: '/save',
      name: 'Vuesave',
      component: () => import('@/views/manage/save'),
      meta: {
        title: '寄存管理',
        noCache: true,
        perms: ['POST /api/v1/branch/list', 'GET /api/v1/branch/del', 'POST /api/v1/branch/add', 'POST /api/v1/branch/edit', 'POST /api/v1/auth_rule/all']
      }
    },
    {
      path: '/finance',
      name: 'Vuefinance',
      component: () => import('@/views/manage/finance'),
      meta: {
        title: '业务结算',
        noCache: true,
        perms: ['POST /api/v1/branch/list', 'GET /api/v1/branch/del', 'POST /api/v1/branch/add', 'POST /api/v1/branch/edit', 'POST /api/v1/auth_rule/all']
      }
    }

  ]
}
export default manageRouter
