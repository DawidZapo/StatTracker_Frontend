<script setup>

import {computed, ref, watch} from "vue";
import {useStore} from "vuex";
import PlayerService from "@/services/player/player.service.js";
import {createStatsComputed} from "@/assets/scripts/stats.js";
import Loading from "@/components/error/Loading.vue";

const store = useStore();
const playerWithSeasons = ref([]);
const selectedPlayerId = computed(()=> store.getters.selectedPlayerId);

const fetchPlayerWithSeasons = async (id) => {
  try{
    if(id){
      playerWithSeasons.value = await PlayerService.fetchPlayerWithStatsTotalsWithSeason(id);
    }
  }
  catch (error) {
    console.error("Error while fetching player with stats totals with season: " + error);
  }
};

watch(selectedPlayerId, (newId) =>{
  fetchPlayerWithSeasons(newId);
});
fetchPlayerWithSeasons(selectedPlayerId.value);


</script>

<template>
  <div class="container shadow-lg">
    <div class="d-flex justify-content-center">
        <h5 class="mt-2">Totals</h5>
    </div>
    <hr class="my-2">
    <template v-if="playerWithSeasons !== null">
      <table class="table table-striped table-hover table-bordered small-text text-center">
        <thead>
        <tr>
          <th scope="col">Season</th>
          <th scope="col">Player</th>
          <th scope="col">M</th>
          <th scope="col">S5</th>
          <th scope="col">MIN</th>
          <th scope="col">PTS</th>
          <th scope="col">2PT</th>
          <th scope="col">3PT</th>
          <th scope="col">FT</th>
          <th scope="col">FG</th>
          <th scope="col">OR</th>
          <th scope="col">DF</th>
          <th scope="col">A</th>
          <th scope="col">F</th>
          <th scope="col">FF</th>
          <th scope="col">TO</th>
          <th scope="col">S</th>
          <th scope="col">B</th>
          <th scope="col">BR</th>
          <th scope="col">PS</th>
          <th scope="col">Eval</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="player in playerWithSeasons">
          <td>{{player.season}}</td>
          <td>{{ player.fullName }}</td>
          <td>{{ player.numberOfGames }}</td>
          <td>{{player.startingFive}}</td>
          <td>{{player.timeOnCourtInMin}}</td>
          <td>{{player.totalPoints}}</td>
          <td>{{player.twoPointShotsMade}} / {{player.twoPointShotsAttempted}}</td>
          <td>{{player.threePointShotsMade}} / {{player.threePointShotsAttempted}}</td>
          <td>{{player.freeThrowsMade}} / {{player.freeThrowsAttempted}}</td>
          <td>{{player.twoPointShotsMade + player.threePointShotsMade}} / {{player.twoPointShotsAttempted + player.threePointShotsAttempted}}</td>
          <td>{{player.offRebounds}}</td>
          <td>{{player.defRebounds}}</td>
          <td>{{player.assists}}</td>
          <td>{{player.fouls}}</td>
          <td>{{player.forcedFouls}}</td>
          <td>{{player.turnOvers}}</td>
          <td>{{player.steals}}</td>
          <td>{{player.blocks}}</td>
          <td>{{player.blocksReceived}}</td>
          <td>{{player.possessions}}</td>
          <td>{{player.evaluation}}</td>
        </tr>
        </tbody>
      </table>

      <div class="d-flex justify-content-center mt-2">
        <h5>Averages</h5>
      </div>
      <hr class="my-2">
      <table class="table table-striped table-hover table-bordered small-text text-center">
        <thead>
        <tr>
          <th scope="col">Season</th>
          <th scope="col">Player</th>
          <th scope="col">M</th>
          <th scope="col">S5</th>
          <th scope="col">MIN</th>
          <th scope="col">PTS</th>
          <th scope="col">2PT %</th>
          <th scope="col">3PT %</th>
          <th scope="col">FT %</th>
          <th scope="col">FG %</th>
          <th scope="col">OR</th>
          <th scope="col">DF</th>
          <th scope="col">A</th>
          <th scope="col">F</th>
          <th scope="col">FF</th>
          <th scope="col">TO</th>
          <th scope="col">S</th>
          <th scope="col">B</th>
          <th scope="col">BR</th>
          <th scope="col">PS</th>
          <th scope="col">Eval</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="player in playerWithSeasons">
          <td>{{player.season}}</td>
          <td>{{ player.fullName }}</td>
          <td>{{ player.numberOfGames }}</td>
          <td>{{(player.startingFive / player.numberOfGames).toFixed(2)}}</td>
          <td>{{player.stats.averageTimeOnCourtInMin}}</td>
          <td>{{player.stats.averagePoints}}</td>
          <td>{{player.stats.twoPointPercentage}}</td>
          <td>{{player.stats.threePointPercentage}}</td>
          <td>{{player.stats.freeThrowPercentage}}</td>
          <td>{{player.stats.fieldGoalPercentage}}</td>
          <td>{{player.stats.averageOffRebounds}}</td>
          <td>{{player.stats.averageDefRebounds}}</td>
          <td>{{player.stats.averageAssists}}</td>
          <td>{{player.stats.averageFouls}}</td>
          <td>{{player.stats.averageForcedFouls}}</td>
          <td>{{player.stats.averageTurnovers}}</td>
          <td>{{player.stats.averageSteals}}</td>
          <td>{{player.stats.averageBlocks}}</td>
          <td>{{player.stats.averageBlocksReceived}}</td>
          <td>{{player.stats.averagePossessions}}</td>
          <td>{{player.stats.averageEval}}</td>
        </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <Loading></Loading>
    </template>
    <div style="height: 1px"></div>
  </div>
</template>

<style scoped>

</style>
