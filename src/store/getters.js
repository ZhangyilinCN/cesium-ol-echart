const getters = {
  isShowAll: state =>
    state.isShowLeft1 &&
    state.isShowLeft2 &&
    state.isShowLeft3 &&
    state.isShowRight1 &&
    state.isShowRight2 &&
    state.isShowRight3 &&
    state.isShowBottom1 &&
    state.isShowBottom2 &&
    state.isShowBottom3,
}
export default getters
