<script setup>
import {computed, onBeforeMount, ref} from 'vue';
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import TeamService from "@/services/team/team.service.js";

const store = useStore();
const router = useRouter();

// const teams = ref([
//   {id: 1, name: 'KTK Knurow', location: 'City A', founded: 2000},
//   {id: 2, name: 'GTK Gliwice', location: 'City B', founded: 1995},
//   {id: 3, name: 'Slask Wroclaw', location: 'City C', founded: 2010},
//   {id: 4, name: 'Legia Warszawa', location: 'City A', founded: 2000},
//   {id: 5, name: 'Arka Gdynia', location: 'City B', founded: 1995},
//   {id: 6, name: 'Anwil Wloclawek', location: 'City C', founded: 2010},
//   {id: 7, name: 'AZS Koszalin', location: 'City A', founded: 2000},
//   {id: 8, name: 'Dabrowa Gornicza', location: 'City B', founded: 1995},
//   {id: 9, name: 'Czarni Slupsk', location: 'City C', founded: 2010},
//   {id: 10, name: 'Polonia Warszawa', location: 'City A', founded: 2000},
//   {id: 11, name: 'Trefl Sopot', location: 'City B', founded: 1995},
//   {id: 12, name: 'Miasto Szkla Krosno', location: 'City C', founded: 2010}
// ]);
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
              <router-link to="/teams/records" class="nav-link">TeamWithPlayers Records</router-link>
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
      <div v-else>
        <h3>Network Error</h3>
      </div>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>

  </div>
</template>


<style scoped>

</style>
