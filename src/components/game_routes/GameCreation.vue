<script setup>

import {computed, ref, watch} from "vue";
import TeamService from "@/services/team/team.service.js";
import {useStore} from "vuex";
import GameCreated from "@/models/game/GameCreated.js";
import GameService from "@/services/game/game.service.js";
import {useRouter} from "vue-router";


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
};

const transformPlayersList = (players) => {
  return players.map(player => ({
    id: player.id,
    firstName: player.firstName,
    lastName: player.lastName,
    shirtNumber: player.shirtNumber,
    startingFive: player.startingFive
  }));
};

fetchAllTeams();

const createGameId = ref(null);
const store = useStore();
const router = useRouter();
const myDate = ref(today);
const seasons = ref(generateSeasons(myDate.value));
const selectedHomeId = computed(()=> store.getters.selectedHomeTeamId);
const selectedAwayId = computed(()=> store.getters.selectedAwayTeamId);
const selectedHome = ref(null);
const selectedAway = ref(null);
const isHomeValid = ref(false);
const isAwayValid = ref(false);
const isTheSameTeamSelected = computed(()=> {
  if(selectedAwayId.value === null || selectedHomeId.value === null){
    return false;
  }
  else{
    return selectedHomeId.value === selectedAwayId.value;
  }
});
const isSubmissionValid = computed(()=>{
  return isAwayValid.value && isHomeValid.value && selectedHome !== null && selectedAway !== null;
});

const selectedHomePlayersForGame = ref([]);
const selectedAwayPlayersForGame = ref([]);
const formattedHomePlayers = computed(()=>{
  return transformPlayersList(selectedHomePlayersForGame.value);
});
const formattedAwayPlayers = computed(()=>{
  return transformPlayersList(selectedAwayPlayersForGame.value);
});


const gameData = ref({
  id: null,
  date: today,
  time: currentTime,
  season: seasons.value[0],
  official: true,
  quarterLengthMin: 10,
  home: computed(() => ({
    id: selectedHome.value.id,
    name: selectedHome.value.name,
    players: formattedHomePlayers.value
  })),
  away: computed(() => ({
    id: selectedAway.value.id,
    name: selectedAway.value.name,
    players: formattedAwayPlayers.value
  }))
});

function validatePlayerList(players) {
  const numPlayers = players.length;
  const numStartingFive = players.filter(player => player.startingFive).length;

  if (numPlayers < 5 || numPlayers > 12) {
    return false;
  }
  if (numStartingFive !== 5) {
    return false;
  }
  return true;
}

const validateShirtNumbers = (players) => {
  const shirtNumbers = players.map(player => player.shirtNumber);
  const areNumbersInRange = shirtNumbers.every(number => number >= 0 && number <= 99);
  const uniqueShirtNumbers = new Set(shirtNumbers);
  return shirtNumbers.length === uniqueShirtNumbers.size && areNumbersInRange;
};
const validateInput = (player) => {
  let value = parseInt(player.shirtNumber, 10);

  if (isNaN(value)) {
    player.shirtNumber = null;
  } else if (value < 0 || value > 99) {
    player.shirtNumber = Math.max(0, Math.min(value, 99));
  }

};


watch(selectedHomePlayersForGame, (newPlayers, oldPlayers) => {
  isHomeValid.value = validatePlayerList(newPlayers) && validateShirtNumbers(newPlayers);
}, { deep: true });
watch(selectedAwayPlayersForGame, (newPlayers, oldPlayers) => {
  isAwayValid.value = validatePlayerList(newPlayers) && validateShirtNumbers(newPlayers);
}, { deep: true });

watch(selectedHome, (newValue, oldValue) => {
  if (newValue && (!oldValue || newValue.id !== oldValue.id)) {
    selectedHomePlayersForGame.value = [];
  }
});
watch(selectedAway, (newValue, oldValue) => {
  if (newValue && (!oldValue || newValue.id !== oldValue.id)) {
    selectedAwayPlayersForGame.value = [];
  }
});


const handleSelectionForGame = (player, isSelected) => {
  if(isSelected){
    player.startingFive = false;
  }
};

const handleDisable = (id, isHome) => {
  if(isHome){
    return !selectedHomePlayersForGame.value.map(player => player.id).includes(id);
  }
  else{
    return !selectedAwayPlayersForGame.value.map(player => player.id).includes(id);
  }
};



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


const handleSubmit = async () => {
  const gameCreated = new GameCreated(gameData.value);
  try{
    // createGameId.value = await GameService.createGame(gameCreated);
    await store.dispatch('selectGame', 11241241124);
     await router.push('/game_handler');
  }
  catch (error){
    console.error("Error while creating game: " + error);
  }
};

</script>

<template>
  <div class="container shadow-lg">
    <form @submit.prevent="handleSubmit">
      <div class="d-flex justify-content-center">
        <h5 class="mt-4">Game Details</h5>
      </div>
      <hr class="my-2">
      <div class="container text-center">
        <div class="row">
          <div class="col">
            <div class="row d-flex align-items-center justify-content-center mx-4">
              <h6 class="mx-1">Date</h6>
              <input type="date" class="small-text custom-input text-center" v-model="gameData.date">
            </div>
          </div>
          <div class="col">
            <div class="row d-flex align-items-center justify-content-center mx-4">
              <h6 class="mx-1">Time</h6>
              <input type="time" class="small-text custom-input text-center" v-model="gameData.time">
            </div>
          </div>
          <div class="col">
            <div class="row d-flex align-items-center justify-content-center mx-4">
              <h6 class="mx-1">Season</h6>
              <select class="small-text custom-input text-center" v-model="gameData.season">
                <option v-for="season in seasons" :value="season">{{season}}</option>
              </select>
            </div>
          </div>
          <div class="col">
            <div class="row d-flex align-items-center justify-content-center justify-content-center mx-4">
              <h6 class="mx-1">Official</h6>
              <input type="checkbox" class="small-text text-center" v-model="gameData.official">
            </div>
          </div>
          <div class="col">
            <div class="row d-flex align-items-center justify-content-center mx-4">
              <h6 class="mx-1">Quarter</h6>
              <input type="number" class="small-text custom-input text-center" v-model="gameData.quarterLengthMin">
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center mt-4">
        <h5 class="mt-2">Teams</h5>
      </div>
      <hr class="my-2">
      <div class="container">
        <div v-show="isTheSameTeamSelected" class="alert alert-danger small-text" style="padding: 3px; text-align: center">The same team selected</div>
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
                  <table class="table table-striped table-hover table-bordered small-text text-center">
                    <thead>
                    <tr>
                      <th scope="col">Selected</th>
                      <th scope="col">Player</th>
                      <th scope="col">S5</th>
                      <th scope="col">Shirt no.</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(player,index) in selectedHome.currentPlayers">
                      <td style="width: 10%; align-content: center">
                        <input type="checkbox" :value="player" v-model="selectedHomePlayersForGame" @change="handleSelectionForGame(player, $event)">
                      </td>
                      <td style="align-content: center" :class="{'disabled' : handleDisable(player.id, true)}">
                        {{ player.firstName + ' ' + player.lastName }}
                      </td>
                      <td style="width: 10%; align-content: center" :class="{'disabled' : handleDisable(player.id, true)}">
                        <input type="checkbox" v-model="player.startingFive">
                      </td>
                      <td style="width: 20%; align-content: center" :class="{'disabled' : handleDisable(player.id, true)}">
                        <input type="number" class="custom-input" v-model="player.shirtNumber" @input="() => validateInput(player)">
                      </td>
                    </tr>
                    </tbody>
                  </table>
                  <div v-show="!isHomeValid" class="alert alert-danger small-text" style="padding: 3px; text-align: center">Adjust lineup</div>
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
                  <table class="table table-striped table-hover table-bordered small-text text-center">
                    <thead>
                    <tr>
                      <th scope="col">Selected</th>
                      <th scope="col">Player</th>
                      <th scope="col">S5</th>
                      <th scope="col">Shirt no.</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(player,index) in selectedAway.currentPlayers">
                      <td style="width: 10%; align-content: center">
                        <input type="checkbox" :value="player" v-model="selectedAwayPlayersForGame" @change="handleSelectionForGame(player, $event)">
                      </td>
                      <td style="align-content: center" :class="{'disabled' : handleDisable(player.id, false)}">
                        {{ player.firstName + ' ' + player.lastName }}
                      </td>
                      <td style="width: 10%; align-content: center" :class="{'disabled' : handleDisable(player.id, false)}">
                        <input type="checkbox" v-model="player.startingFive">
                      </td>
                      <td style="width: 20%; align-content: center" :class="{'disabled' : handleDisable(player.id, false)}">
                        <input type="number" class="custom-input" v-model="player.shirtNumber" @input="() => validateInput(player)">
                      </td>
                    </tr>
                    </tbody>
                  </table>
                  <div v-show="!isAwayValid" class="alert alert-danger small-text" style="padding: 3px; text-align: center">Adjust lineup</div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <button :disabled="!isSubmissionValid || isTheSameTeamSelected" type="submit" class="btn btn-success w-100">Create</button>
      </div>
    </form>
  </div>
</template>

<style scoped>

</style>
