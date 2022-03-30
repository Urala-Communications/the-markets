export const state = () => ({
  coins: [],
})

export const mutations = {
  SET_COINS (state, value) {
    // console.log('SET_COINS', value)
    state.coins = value
  },
}

export const getters = {
  COINS_LENGTH: state => state.coins.length,
  GET_COINS: state => state.coins,
}
