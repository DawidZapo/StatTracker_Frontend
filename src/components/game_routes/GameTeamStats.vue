<script setup>

import {useStore} from "vuex";
import {computed, ref, watch} from "vue";
import GameService from "@/services/game/game.service.js";
import Loading from "@/components/error/Loading.vue";

const store = useStore();
const selectedGameId = computed(()=> store.getters.selectedGameId);
const game = ref(null);

const fetchGame = async (id) => {
  try{
    if(id){
      game.value = await GameService.fetchGameWithStatTeams(id);
    }
  }catch (error) {
    console.error("Error while fetching game with stat teams: " + error);
    game.value = null;
  }
};

fetchGame(selectedGameId.value);
watch(selectedGameId, (newId) => {
  fetchGame(newId);
});

</script>

<template>
  <div v-if="game !== null" class="container shadow-lg p-3">
    <div class="row d-flex justify-content-center event-info">
      <div class="col-4 text-center event-info">
        <div class="d-flex justify-content-between">
          <div>{{game.date}}</div>
          <div class="line">|</div>
          <div>{{game.time}}</div>
          <div class="line">|</div>
          <div>{{game.home.arena}}</div>
          <div class="line">|</div>
          <div>{{ game.home.location }}</div>
        </div>
      </div>
    </div>
    <hr class="my-2"></hr>
    <div class="row">
        <div class="col-3 text-end d-flex align-items-center justify-content-end">
          <h1>{{game.home.name}}</h1>
        </div>
        <div class="col-6" style="align-content: center">
          <div class="row">
            <div class="col-4 text-end">
              <h1>{{ game.home.statLine.totalPoints }}</h1>
            </div>
            <div class="col-4">
              <div class="row text-center event-info">
                <div class="d-flex justify-content-between">
                  <div v-for="quarter in game.home.scores">{{quarter}}</div>
                </div>
              </div>
              <div class="d-flex justify-content-between event-info">
                <div v-for="quarter in game.away.scores">{{quarter}}</div>
              </div>
            </div>
            <div class="col-4 text-start">
              <h1>{{ game.away.statLine.totalPoints }}</h1>
            </div>
          </div>
        </div>
        <div class="col-3 text-start d-flex align-items-center justify-content-start">
          <h1>{{game.away.name}}</h1>
        </div>
    </div>
  </div>
  <div v-else class="container shadow-lg">
    <Loading></Loading>
  </div>
</template>

<style scoped>
.event-info {
  color: #6c757d;
  font-size: 1rem;
  font-weight: 400;
  /*font-family: "Oswald-Light";*/
}
.line{
  color: #C6C7C8FF;
}

</style>
