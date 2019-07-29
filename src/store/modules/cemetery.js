
const state = {
  cems: null,
  pay: '',
  order: 0,
  cname: ''
}

const mutations = {
  ADD_CEMETERY: (state, cems) => {
    state.cems = cems
  },
  ADD_PAY: (state, pay) => {
    state.pay = pay
  },
  ADD_INDEX: (state, order) => {
    state.order = parseInt(order)
  },
  ADD_CNAME: (state, cname) => {
    state.cname = cname
  }
}

const actions = {
  addCemetery({ commit }, cems) {
    commit('ADD_CEMETERY', cems)
  },
  changeOrders({ commit }, order) {
    commit('ADD_INDEX', order)
  },
  addCname({ commit }, cname) {
    commit('ADD_CNAME', cname)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
