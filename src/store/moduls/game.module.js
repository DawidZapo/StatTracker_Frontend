export const game = {
    state: () => ({
        selectedGameId: null
    }),
    mutations: {
        setSelectedGameId(state, gameId) {
            state.selectedGameId = gameId;
        },
        resetSelectedGameId(state) {
            state.selectedGameId = null;
        }
    },
    actions: {
        selectGame({ commit }, gameId) {
            commit('setSelectedGameId', gameId);
        },
        resetGame({ commit }) {
            commit('resetSelectedGameId');
        }
    },
    getters: {
        selectedGameId: (state) => state.selectedGameId
    }
};
