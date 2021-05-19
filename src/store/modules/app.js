const state = {
  device: 'desktop',
  coordinate: {}
}

const mutations = {
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  getCoordinate: (state, data) => {
    // console.log(8888, data)
    state.coordinate = data
  }
}

const actions = {
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  // namespaced: true,
  state,
  mutations,
  actions
}
