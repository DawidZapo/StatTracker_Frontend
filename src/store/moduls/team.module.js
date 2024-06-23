export const team = {
    state: () => ({
        selectedTeamId: null
    }),
    mutations: {
        setSelectedTeamId(state, teamId) {
            state.selectedTeamId = teamId;
        },
        resetSelectedTeamId(state) {
            state.selectedTeamId = null;
        }
    },
    actions: {
        selectTeam({ commit }, teamId) {
            commit('setSelectedTeamId', teamId);
        },
        resetTeam({ commit }) {
            commit('resetSelectedTeamId');
        }
    },
    getters: {
        selectedTeamId: (state) => state.selectedTeamId
    }
};
