<script setup>
import {computed, ref} from 'vue';

const teams = ref([
  {id: 1, name: 'Loooooooooooong one', location: 'City A', founded: 2000},
  {id: 2, name: 'Team B', location: 'City B', founded: 1995},
  {id: 3, name: 'Team C', location: 'City C', founded: 2010},
  {id: 1, name: 'Team A', location: 'City A', founded: 2000},
  {id: 2, name: 'Team B', location: 'City B', founded: 1995},
  {id: 3, name: 'Team C', location: 'City C', founded: 2010},
  {id: 1, name: 'Team A', location: 'City A', founded: 2000},
  {id: 2, name: 'Team B', location: 'City B', founded: 1995},
  {id: 3, name: 'Team C', location: 'City C', founded: 2010},
  {id: 1, name: 'Team A', location: 'City A', founded: 2000},
  {id: 2, name: 'Team B', location: 'City B', founded: 1995},
  {id: 3, name: 'Team C', location: 'City C', founded: 2010},
  // Add more teams here
]);

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
};
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
        <div class="d-flex justify-content-center align-items-center">
          <ul class="navbar-nav mr-auto mx-5">
            <li class="nav-item">
              <router-link to="/teams/info" class="nav-link">Info</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/teams/stats" class="nav-link">Teams Stats</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/teams/records" class="nav-link">Team Records</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/teams/players_stats" class="nav-link">Players' Stats</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/teams/players_records" class="nav-link">Players' Records</router-link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
    <div v-else>
      <p>Please select a team.</p>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>

  </div>
</template>


<style scoped>

</style>
