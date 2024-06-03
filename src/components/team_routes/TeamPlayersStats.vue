<script setup>
import {useStore} from "vuex";
import {computed, ref, watch} from "vue";
import TeamService from "@/services/team/team.service.js";
import Loading from "@/components/error/Loading.vue";

const store = useStore();
const selectedTeamId = computed(() => store.getters.selectedTeamId);
const teamWithPlayerStatsTotals = ref(null);
const seasons = ref([]);
const selectedSeason = ref('all');
const all = ref('all');

const fetchTeamWithPlayerStatsTotals = async (id, season = null) => {
  try{
    if(id){
      if(season != null){
        teamWithPlayerStatsTotals.value = await TeamService.fetchTeamWithPlayerStatsTotals(id, season);
      }
      else{
        teamWithPlayerStatsTotals.value = await TeamService.fetchTeamWithPlayerStatsTotals(id, 'all');
      }
    }
  }catch (error) {
    console.error("Error while fetching team with player stats totals: ", error);
  }
};
const fetchSeasons = async (id) => {
  try{
    if(id){
      seasons.value = await TeamService.fetchPossibleSeasonsFromTeam(id);
    }
    else{
      seasons.value = [];
    }
  }catch (error){
    console.error("Error while fetching possible seasons");
  }
};

watch(selectedTeamId, (newId) => {
  fetchTeamWithPlayerStatsTotals(newId);
});
watch(selectedSeason, (newSeason) => {
  fetchTeamWithPlayerStatsTotals(selectedTeamId.value, newSeason);
});
fetchTeamWithPlayerStatsTotals(selectedTeamId.value);
fetchSeasons(selectedTeamId.value);


</script>


<template>
  <div class="container shadow-lg">
    <div class="d-flex">
      <div class="col-md-4 d-flex align-items-center">
        <template v-if="seasons.length !== 0">
          <select id="season-select" class="form-control w-50 small-text text-center" v-model="selectedSeason">
            <option :value="all" value="all">All seasons</option>
            <option v-for="season in seasons" :key="season" :value="season">
              {{ season }}
            </option>
          </select>
        </template>
      </div>
      <div class="col-md-4 d-flex justify-content-center">
        <h5 class="mt-2">Players' Totals</h5>
      </div>
      <div class="col-md-4">

      </div>
    </div>
    <hr class="my-2">
    <template v-if="teamWithPlayerStatsTotals !== null">
      <table class="table table-striped table-hover table-bordered small-text">
        <thead>
        <tr>
          <th scope="col">Player</th>
          <th scope="col">M</th>
          <th scope="col">S5</th>
          <th scope="col">MIN</th>
          <th scope="col">Pts</th>
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
        <tr v-for="player in teamWithPlayerStatsTotals.players">
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
      <table class="table table-striped table-hover table-bordered small-text">
        <thead>
        <tr>
          <th scope="col">Player</th>
          <th scope="col">M</th>
          <th scope="col">S5</th>
          <th scope="col">MIN</th>
          <th scope="col">Pts</th>
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
        <tr v-for="player in teamWithPlayerStatsTotals.players">
          <td>{{ player.fullName }}</td>
          <td>{{ player.numberOfGames }}</td>
          <td>{{(player.startingFive / player.numberOfGames).toFixed(2)}}</td>
          <td>{{player.timeOnCourtInMin}}</td>
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
td, th{
  text-align: center;
}
</style>
