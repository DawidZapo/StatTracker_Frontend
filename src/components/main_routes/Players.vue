<script setup>
import {computed, ref} from "vue";
import PlayerService from "@/services/player/player.service.js";
import {useRouter} from "vue-router";
import {useStore} from "vuex";

const search = ref('');
const players = ref([]);
const router = useRouter();
const store = useStore();
const selectedPlayer = ref(null);

const fetchPlayers = async () => {
  try {
    players.value = await PlayerService.fetchAllPlayerWithTeam();
  } catch (error) {
    console.error("Error while fetching players with teams");
    players.value = null;
  }
};

fetchPlayers();

const filteredPlayers = computed(() => {
  if (!search.value) {
    return [];
  }
  return players.value.filter(player =>
      player.firstName.toLowerCase().includes(search.value.toLowerCase()) ||
      player.lastName.toLowerCase().includes(search.value.toLowerCase())
  );
});
const handleInput = () => {
  if (selectedPlayer) {
    selectedPlayer.value = null;
  }
};
const handlePlayerClick = (player) => {
  selectedPlayer.value = player;
  search.value = player.lastName;
  store.dispatch('selectPlayer', player.id);
  router.push({path: '/players/info'})
};
</script>

<template>
  <div>
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="container-fluid">
        <div class="navbar-brand" style="font-size: 1.1rem">Players</div>
        <div class="collapse navbar-collapse" id="navbarNav">
          <div class="input-group">
            <input @input="handleInput" type="text" class="form-control" placeholder="Search player" v-model="search">
          </div>
        </div>
      </div>
    </nav>
    <div v-if="!selectedPlayer">
      <div class="container mt-1">
        <div v-if="filteredPlayers.length === 0" class="mt-4" >
          <h3> Please search player</h3>
        </div>
        <div v-else>
          <div class="card card-body small-text text-center">
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
        <div v-for="player in filteredPlayers" :key="player.id" class="card mb-1">
          <div class="card-body small-text text-center" @click="handlePlayerClick(player)" style="cursor: pointer">
            <div class="row">
              <div class="col">
                {{ player.firstName }}
              </div>
              <div class="col">
                {{ player.lastName }}
              </div>
              <div class="col">
                {{ player.teamName }}
              </div>
              <div class="col">
                {{ player.position }}
              </div>
              <div class="col">
                {{ player.birth }}
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
              <router-link to="/players/info" class="nav-link">Player Info</router-link>
            </li>
            <li class="nav-item mx-3">
              <router-link to="/players/stats" class="nav-link">Player Stats</router-link>
            </li>
            <li class="nav-item mx-3">
              <router-link to="/players/records" class="nav-link">Player Records</router-link>
            </li>
          </ul>
        </div>
      </nav>
      <router-view></router-view>
    </div>
  </div>

</template>

<style scoped>
.card-body {
  transition: opacity 0.3s ease;
}
.card-body:hover {
  opacity: 0.8;
}
</style>
