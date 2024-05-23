<script setup>
import {useStore} from "vuex";
import {computed, onMounted, ref, watch} from "vue";
import TeamService from "@/services/team/team.service.js";

const store = useStore();
const selectedTeamId = computed(() => store.getters.selectedTeamId);

const team = ref(null);
const fetchTeamData = async (id) => {
  try {
    if (id) {
      const response = await TeamService.fetchTeam(id);
      team.value = response;
    } else {
      team.value = null;
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
  team.value.currentPlayers.sort((a, b) => {
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
    <template v-if="team !== null">
      <div class="d-flex container mt-3">
        <div class="col-md-3">
          <div class="card">
            <div class="card-header text-center">
              <h4>{{ team.name }}</h4>
            </div>
            <div class="card-body">
              <div class="row mb-2">
                <div class="col-sm-6 fw-bold">
                  Location:
                </div>
                <div class="col-sm-6">
                  {{ team.location }}
                </div>
              </div>
              <div class="row mb-2">
                <div class="col-sm-6 fw-bold">
                  Arena:
                </div>
                <div class="col-sm-6">
                  {{ team.arena }}
                </div>
              </div>
              <div class="row mb-2">
                <div class="col-sm-6 fw-bold">
                  Address:
                </div>
                <div class="col-sm-6">
                  {{ team.address }}
                </div>
              </div>
              <div class="row mb-2">
                <div class="col-sm-6 fw-bold">
                  Players:
                </div>
                <div class="col-sm-6">
                  {{ team.currentPlayers.length }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-9 mx-5">
          <div class="table-container">
            <table class="table table-striped table-hover table-bordered">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col" @click="sortPlayers('lastName')">
                  Full name
                  <i :class="sortColumn === 'lastName' ? sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down' : 'fas fa-sort'"></i>
                </th>
                <th scope="col" @click="sortPlayers('height')">
                  Height
                  <i :class="sortColumn === 'height' ? sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down' : 'fas fa-sort'"></i>
                </th>
                <th scope="col" @click="sortPlayers('weight')">
                  Weight
                  <i :class="sortColumn === 'weight' ? sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down' : 'fas fa-sort'"></i>
                </th>
                <th scope="col" @click="sortPlayers('position')">
                  Position
                  <i :class="sortColumn === 'position' ? sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down' : 'fas fa-sort'"></i>
                </th>
                <th scope="col" @click="sortPlayers('birth')">
                  Birth
                  <i :class="sortColumn === 'birth' ? sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down' : 'fas fa-sort'"></i>
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(player,index) in team.currentPlayers" :key="player.id">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ player.lastName }} {{player.firstName}}</td>
                <td>{{ player.height }}</td>
                <td>{{ player.weight }}</td>
                <td>{{ player.position }}</td>
                <td>{{player.birth}}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
