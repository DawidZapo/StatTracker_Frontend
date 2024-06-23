export const awayTeam = {
    state: () => ({
        selectedAwayTeamId: null
    }),
    mutations: {
        setSelectedAwayTeamId(state, teamId) {
            state.selectedAwayTeamId = teamId;
        },
        resetSelectedAwayTeamId(state) {
            state.selectedAwayTeamId = null;
        }
    },
    actions: {
        selectAwayTeam({ commit }, teamId) {
            commit('setSelectedAwayTeamId', teamId);
        },
        resetAwayTeam({ commit }) {
            commit('resetSelectedAwayTeamId');
        }
    },
    getters: {
        selectedAwayTeamId: (state) => state.selectedAwayTeamId
    }
};
