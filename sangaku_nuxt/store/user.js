export const state = () => ({
  user: ""
})

export const getters = {
  user: (state) => state.user
}

export const mutations = {
  setUser(state, user ) {
    state.user = user
  },

  clearUser(state) {
    state.user = ""
  }
}

export const actions = {
  async fecthUser({ commit }, user ) {
    commit('setUser', user )
  }
}