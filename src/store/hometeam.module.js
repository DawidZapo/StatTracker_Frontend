export const homeTeam = {
    state: () => ({
        selectedHomeTeamId: null
    }),
    mutations: {
        setSelectedHomeTeamId(state, teamId) {
            state.selectedHomeTeamId = teamId;
        },
        resetSelectedHomeTeamId(state) {
            state.selectedHomeTeamId = null;
        }
    },
    actions: {
        selectHomeTeam({ commit }, teamId) {
            commit('setSelectedHomeTeamId', teamId);
        },
        resetHomeTeam({ commit }) {
            commit('resetSelectedHomeTeamId');
        }
    },
    getters: {
        selectedHomeTeamId: (state) => state.selectedHomeTeamId
    }
};
