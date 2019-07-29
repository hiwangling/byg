import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  info: '',
  config: null,
  introduction: '',
  perms: [],
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_INFO: (state, info) => {
    state.info = info
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PERMS: (state, perms) => {
    state.perms = perms
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_CONFIG: (state, config) => {
    state.config = config
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const data = response.data
        if (data.perms && data.perms.length > 0) { // 验证返回的perms是否是一个非空数组
          commit('SET_PERMS', data.perms)
        } else {
          reject('getInfo: perms must be a non-null array !')
        }
        commit('SET_ROLES', data.roles)
        commit('SET_INFO', data.manager_info)
        commit('SET_CONFIG', data.config)
        commit('SET_NAME', data.manager_info.username)
        commit('SET_AVATAR', 'http://img.soogif.com/0whkGm7bQqCwgKJJ6RyR9hMpbq6AqL1C.gif')
        commit('SET_INTRODUCTION', data.manager_info.email)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
    commit('SET_PERMS', [])
    removeToken()
    resetRouter()
    // resolve()
    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     commit('SET_TOKEN', '')
    //     commit('SET_ROLES', [])
    //     commit('SET_PERMS', [])
    //     removeToken()
    //     resetRouter()
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role
      commit('SET_TOKEN', token)
      setToken(token)

      const { perms } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', perms, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
