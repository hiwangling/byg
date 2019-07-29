/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const taskRouter = {
  path: '/task',
  component: Layout,
  alwaysShow: true,
  name: 'Vuetask',
  meta: { title: '任务中心', icon: 'star' },
  children: [
    {
      path: '/carsend',
      name: 'Vuecarsend',
      component: () => import('@/views/task/carsend'),
      meta: {
        title: '接运管理',
        noCache: true,
        perms: ['POST /api/v1/branch/list', 'GET /api/v1/branch/del', 'POST /api/v1/branch/add', 'POST /api/v1/branch/edit', 'POST /api/v1/auth_rule/all']
      }
    }

  ]
}
export default taskRouter
