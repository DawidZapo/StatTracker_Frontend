<script setup>
import {useStore} from "vuex";
import {computed, onMounted, ref, watch} from "vue";
import TeamService from "@/services/team/team.service.js";

const store = useStore();
const selectedTeamId = computed(() => store.getters.selectedTeamId);

const teamWithPlayers = ref(null);
const fetchTeamData = async (id) => {
  try {
    if (id) {
      const response = await TeamService.fetchTeam(id);
      teamWithPlayers.value = response;
    } else {
      teamWithPlayers.value = null;
    }
  } catch (error) {
    console.error("Error while fetching team: ", error);
  }
};

watch(selectedTeamId, (newId) => {
  fetchTeamData(newId);
});
fetchTeamData(selectedTeamId.value);


const sortColumn = ref('');
const sortDirection = ref('asc');
const sortPlayers = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
  teamWithPlayers.value.currentPlayers.sort((a, b) => {
    let comparison = 0;
    if (a[column] > b[column]) {
      comparison = 1;
    } else if (a[column] < b[column]) {
      comparison = -1;
    }
    return sortDirection.value === 'asc' ? comparison : -comparison;
  });
};


</script>

<template>
  <div>
    <template v-if="teamWithPlayers !== null">
      <div class="d-flex container mt-3">
        <div class="col-md-3">
          <div class="card small-text">
            <div class="card-header text-center">
              <h4>{{ teamWithPlayers.name }}</h4>
            </div>
            <div class="card-body">
              <div class="row mb-2">
                <div class="col-sm-6 fw-bold">
                  Location:
                </div>
                <div class="col-sm-6">
                  {{ teamWithPlayers.location }}
                </div>
              </div>
              <div class="row mb-2">
                <div class="col-sm-6 fw-bold">
                  Arena:
                </div>
                <div class="col-sm-6">
                  {{ teamWithPlayers.arena }}
                </div>
              </div>
              <div class="row mb-2">
                <div class="col-sm-6 fw-bold">
                  Address:
                </div>
                <div class="col-sm-6">
                  {{ teamWithPlayers.address }}
                </div>
              </div>
              <div class="row mb-2">
                <div class="col-sm-6 fw-bold">
                  Players:
                </div>
                <div class="col-sm-6">
                  {{ teamWithPlayers.currentPlayers.length }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-9 mx-5">
          <div class="table-container">
            <table class="table table-striped table-hover table-bordered small-text">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col" @click="sortPlayers('lastName')">
                  Full name
                  <i :class="sortColumn === 'lastName' ? sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down' : 'fas fa-sort'"></i>
                </th>
                <th class="text-center" scope="col" @click="sortPlayers('height')">
                  Height
                  <i :class="sortColumn === 'height' ? sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down' : 'fas fa-sort'"></i>
                </th>
                <th class="text-center" scope="col" @click="sortPlayers('weight')">
                  Weight
                  <i :class="sortColumn === 'weight' ? sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down' : 'fas fa-sort'"></i>
                </th>
                <th class="text-center" scope="col" @click="sortPlayers('position')">
                  Position
                  <i :class="sortColumn === 'position' ? sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down' : 'fas fa-sort'"></i>
                </th>
                <th class="text-center" scope="col" @click="sortPlayers('birth')">
                  Birth
                  <i :class="sortColumn === 'birth' ? sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down' : 'fas fa-sort'"></i>
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(player,index) in teamWithPlayers.currentPlayers" :key="player.id">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ player.lastName }} {{player.firstName}}</td>
                <td class="text-center">{{ player.height }}</td>
                <td class="text-center">{{ player.weight }}</td>
                <td class="text-center">{{ player.position }}</td>
                <td class="text-center">{{player.birth}}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <h5>Network Error</h5>
    </template>
  </div>
</template>

<style scoped>
.table-container {
  max-height: 60vh;
  overflow-y: auto;
}

.table-container table {
  margin-bottom: 0;
}
</style>
