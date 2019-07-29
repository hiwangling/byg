const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  info: state => state.user.info,
  config: state => state.user.config,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  perms: state => state.user.perms,
  permission_routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes,
  errorLogs: state => state.errorLog.logs,
  cems: state => state.cemetery.cems,
  order: state => state.cemetery.order,
  payStatus: state => state.cemetery.pay,
  cname: state => state.cemetery.cname

}
export default getters
