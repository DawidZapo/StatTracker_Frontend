<script setup>
import {computed, onBeforeMount, ref} from 'vue';
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import TeamService from "@/services/team/team.service.js";

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
    return teams.value;
  }
  return teams.value.filter(team => team.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

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
          <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown"
                  aria-expanded="false">
            {{ selectedTeam ? selectedTeam.name : 'Select team' }}
          </button>
          <ul class="dropdown-menu">
            <li v-for="team in filteredTeams" :key="team.id">
              <a class="dropdown-item" @click="selectTeam(team)">{{ team.name }}</a>
            </li>
          </ul>
          <input type="text" class="form-control" placeholder="Search team" v-model="searchQuery">
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
    </div>
    <div v-else>
      <div v-if="!networkError" class="container mt-4">
        <h3>Please select team</h3>
      </div>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>

  </div>
</template>


<style scoped>

</style>
