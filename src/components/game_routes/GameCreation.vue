<script setup>

import {computed, ref, watch} from "vue";
import TeamService from "@/services/team/team.service.js";
import {useStore} from "vuex";

const today = new Date().toISOString().slice(0, 10);
const now = new Date();
let hours = now.getHours();
let minutes = now.getMinutes();
if (hours < 10) {
  hours = '0' + hours;
}
if (minutes < 10) {
  minutes = '0' + minutes;
}
const currentTime = `${hours}:${minutes}`;


const teams = ref([]);

const fetchAllTeams = async () => {
  try{
    teams.value = await TeamService.fetchAllTeam();
  }catch (error) {
    console.error("Error while fetching all teams: " + error);
  }
};

const fetchTeam = async (id, isHome) => {
  try{
    if(id){
      if(isHome){
        selectedHome.value = await TeamService.fetchTeamWithPlayers(id);
      }
      else{
        selectedAway.value = await TeamService.fetchTeamWithPlayers(id);
      }
    }
  }catch (error) {
    console.error("Error while fetching team: " + error);
  }
}

fetchAllTeams();

const store = useStore();
const myDate = ref(today);
const seasons = ref(generateSeasons(myDate.value));
const myTime = ref(currentTime);
const selectedHomeId = computed(()=> store.getters.selectedHomeTeamId);
const selectedAwayId = computed(()=> store.getters.selectedAwayTeamId);
const selectedHome = ref(null);
const selectedAway = ref(null);

function generateSeasons(selectedDate) {
  const startDate = new Date(selectedDate);
  const currentYear = startDate.getFullYear();
  const nextYear = currentYear + 1;

  const currentSeason = `${currentYear}-${nextYear}`;
  const nextSeason = `${currentYear - 1}-${currentYear}`;

  return [currentSeason, nextSeason];
}

watch(myDate, (newDate)=>{
  seasons.value = generateSeasons(newDate);
});

const handleHomeClick = () => {
  const homeSelect = document.getElementById('homeSelect');
  store.dispatch('selectHomeTeam', homeSelect.value);
  fetchTeam(selectedHomeId.value, true);
};
const handleAwayClick = () => {
  const awaySelect = document.getElementById('awaySelect');
  store.dispatch('selectAwayTeam', awaySelect.value);
  fetchTeam(selectedAwayId.value, false);
};

</script>

<template>
  <div class="container shadow-lg">
    <div class="d-flex justify-content-center">
      <h5 class="mt-4">Game Details</h5>
    </div>
    <hr class="my-2">
    <div class="container text-center">
      <div class="row">
        <div class="col">
          <div class="row d-flex align-items-center justify-content-center mx-4">
              <h6 class="mx-1">Date</h6>
              <input type="date" class="small-text custom-input text-center" v-model="myDate">
          </div>
        </div>
        <div class="col">
          <div class="row d-flex align-items-center justify-content-center mx-4">
            <h6 class="mx-1">Time</h6>
            <input type="time" class="small-text custom-input text-center" v-model="myTime">
          </div>
        </div>
        <div class="col">
          <div class="row d-flex align-items-center justify-content-center mx-4">
              <h6 class="mx-1">Season</h6>
              <select class="small-text custom-input text-center">
                <option v-for="season in seasons">{{season}}</option>
              </select>
          </div>
        </div>
        <div class="col">
          <div class="row d-flex align-items-center justify-content-center justify-content-center mx-4">
              <h6 class="mx-1">Official</h6>
              <input type="checkbox" class="small-text text-center">
          </div>
        </div>
        <div class="col">
          <div class="row d-flex align-items-center justify-content-center mx-4">
              <h6 class="mx-1">Quarter</h6>
              <input type="number" class="small-text custom-input text-center">
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center mt-4">
      <h5 class="mt-2">Teams</h5>
    </div>
    <hr class="my-2">
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="card">
            <div class="card-header">
              <select id="homeSelect" class="small-text custom-input text-center" @change="handleHomeClick">
                <option selected disabled>Please select home team</option>
                <option v-for="team in teams" :value="team.id">{{team.name}} </option>
              </select>
            </div>
            <div class="card-body">
              <template v-if="selectedHome !== null">
                {{selectedHome}}
              </template>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card">
            <div class="card-header">
              <select id="awaySelect" class="small-text custom-input text-center" @change="handleAwayClick">
                <option disabled selected>Please select away team</option>
                <option v-for="team in teams" :value="team.id">{{team.name}}</option>
              </select>
            </div>
            <div class="card-body">
              <template v-if="selectedAway !== null">
                {{selectedAway}}
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
