<script setup>
import GameService from "@/services/game/game.service.js";

import {computed, ref} from "vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";

const search = ref('');
const games = ref([]);
const router = useRouter();
const store = useStore();
const selectedGame = ref(null);

const fetchGames = async () => {
  try{
    games.value = await GameService.fetchAllGamesWithTeamNames();

  }catch (error) {
    console.error("Error while fetching games: " + error);
    games.value = null;
  }
};

fetchGames();


const filteredGames = computed(() => {
  if (!search.value) {
    return [];
  }
  return games.value.filter(game =>
      Object.values(game).some(value =>
          typeof value === 'string' &&
          value.toLowerCase().includes(search.value.toLowerCase())
      )
  );
});
const handleInput = () => {
  if (selectedGame) {
    selectedGame.value = null;
  }
};
const handleGameClick = (game) => {
  selectedGame.value = game;
  search.value = game.home + ' - ' + game.away + ' : ' + game.date + ' ' + game.time;
  store.dispatch('selectGame', game.id);
  router.push({path: '/games/stats'});
};

</script>

<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <div class="container-fluid">
      <div class="navbar-brand" style="font-size: 1.1rem">Games</div>
      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="input-group">
          <input @input="handleInput" type="text" class="form-control" placeholder="Search game" v-model="search">
        </div>
      </div>
    </div>
  </nav>
  <div v-if="!selectedGame">
    <div class="container mt-1">
      <div v-if="filteredGames.length === 0" class="mt-4" >
        <h3> Please search game</h3>
      </div>
      <div v-else>
        <div class="card card-body small-text text-center mb-1" style="background-color: #f3f3f3">
          <div class="row">
            <div class="col">
              <strong>First name</strong>
            </div>
            <div class="col">
              <strong>Last name </strong>
            </div>
            <div class="col">
              <strong>Team name</strong>
            </div>
            <div class="col">
              <strong>Position</strong>
            </div>
            <div class="col">
              <strong>Birth</strong>
            </div>
          </div>
        </div>
      </div>
      <div v-for="game in filteredGames" :key="game.id" class="card mb-1">
        <div id="searchCardBody" class="card-body small-text text-center" @click="handleGameClick(game)" style="cursor: pointer">
          <div class="row">
            <div class="col">
              {{ game.id }}
            </div>
            <div class="col">
              {{ game.home }}
            </div>
            <div class="col">
              {{ game.away }}
            </div>
            <div class="col">
              {{ game.date }}
            </div>
            <div class="col">
              {{ game.time }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="height: 1px"></div>
  </div>
  <div v-else>
    <nav class="navbar navbar-expand navbar-light bg-light">
      <div class="w-100">
        <ul class="navbar-nav d-flex justify-content-center">
          <li class="nav-item mx-3">
            <router-link to="/games/stats" class="nav-link">Stats</router-link>
          </li>
          <li class="nav-item mx-3">
            <router-link to="/games/player_stats" class="nav-link">Players' Stats</router-link>
          </li>
          <li class="nav-item mx-3">
            <router-link to="/games/play_by_play" class="nav-link">Play By Play</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style scoped>

</style>
