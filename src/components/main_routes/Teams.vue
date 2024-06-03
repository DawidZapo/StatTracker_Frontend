<script setup>
import {computed, onBeforeMount, ref} from 'vue';
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import TeamService from "@/services/team/team.service.js";
import NetworkError from "@/components/error/Loading.vue";

const store = useStore();
const router = useRouter();

const teams = ref([]);
const networkError = ref(false);
const fetchTeamsData = async () => {
  try {
    teams.value = await TeamService.fetchAllTeam();

  } catch (error) {
    console.error("Error while fetching teams: ", error);
    teams.value = null;
    networkError.value = true;
  }
};
fetchTeamsData();

const searchQuery = ref('');
const selectedTeam = ref(null);

const filteredTeams = computed(() => {
  if (!searchQuery.value) {
    return [];
  }
  return teams.value.filter(team =>
      team.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
const handleInput = () => {
  if(selectedTeam){
    selectedTeam.value = null;
  }
};

const handleTeamClick = (team) => {
  selectedTeam.value = team;
  searchQuery.value = team.name;
  store.dispatch('selectTeam', team.id);
  router.push({path: '/teams/info'});
};

const selectTeam = (team) => {
  selectedTeam.value = team;
  store.dispatch('selectTeam', selectedTeam.value.id);
  router.push({path: '/teams/info'});

};

onBeforeMount(() =>{
  // store.dispatch('team/resetTeam');
  selectedTeam.value = null;
});
</script>


<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <div class="container-fluid">
      <div class="navbar-brand" style="font-size: 1.1rem">Teams</div>
      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="input-group">
          <input @input="handleInput" type="text" class="form-control" placeholder="Search team" v-model="searchQuery">
          <router-link v-show="selectedTeam" to="/teams/edit" class="btn btn-outline-light">Edit Team</router-link>
        </div>
      </div>
    </div>
  </nav>
  <div>
    <div v-if="selectedTeam">
      <nav class="navbar navbar-expand navbar-light bg-light">
        <div class="w-100">
          <ul class="navbar-nav d-flex justify-content-center">
            <li class="nav-item mx-3">
              <router-link to="/teams/info" class="nav-link">Info</router-link>
            </li>
            <li class="nav-item mx-3">
              <router-link to="/teams/stats" class="nav-link">Teams Stats</router-link>
            </li>
            <li class="nav-item mx-3">
              <router-link to="/teams/records" class="nav-link">Team Records</router-link>
            </li>
            <li class="nav-item mx-3">
              <router-link to="/teams/players_stats" class="nav-link">Players' Stats</router-link>
            </li>
            <li class="nav-item mx-3">
              <router-link to="/teams/players_records" class="nav-link">Players' Records</router-link>
            </li>
          </ul>
        </div>
      </nav>
      <div class="container">
        <router-view></router-view>
      </div>
    </div>
    <div v-else>
      <div class="container mt-1">
        <div v-if="filteredTeams.length === 0" class="mt-4" >
          <h3> Please search team</h3>
        </div>
        <div v-else>
          <div class="card card-body small-text text-center mb-1" style="background-color: #f3f3f3">
            <div class="row">
              <div class="col">
                <strong>Team name</strong>
              </div>
              <div class="col">
                <strong>Location </strong>
              </div>
              <div class="col">
                <strong>Arena</strong>
              </div>
            </div>
          </div>
        </div>
        <div v-for="team in filteredTeams" :key="team.id" class="card mb-1">
          <div id="searchCardBody" class="card-body small-text text-center" @click="handleTeamClick(team)" style="cursor: pointer">
            <div class="row">
              <div class="col">
                {{ team.name }}
              </div>
              <div class="col">
                {{ team.location }}
              </div>
              <div class="col">
                {{ team.arena }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="height: 1px"></div>
    </div>
  </div>
</template>


<style scoped>
#searchCardBody {
  transition: opacity 0.3s ease;
}
#searchCardBody:hover {
  opacity: 0.8;
}
</style>
