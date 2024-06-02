export const player = {
    state: () => ({
        selectedPlayerId: null
    }),
    mutations: {
        setSelectedPlayerId(state, playerId) {
            state.selectedPlayerId = playerId;
        },
        resetSelectedPlayerId(state) {
            state.selectedPlayerId = null;
        }
    },
    actions: {
        selectPlayer({ commit }, playerId) {
            commit('setSelectedPlayerId', playerId);
        },
        resetPlayer({ commit }) {
            commit('resetSelectedPlayerId');
        }
    },
    getters: {
        selectedPlayerId: (state) => state.selectedPlayerId
    }
};
