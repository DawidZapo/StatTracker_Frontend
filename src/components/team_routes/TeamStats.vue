<script setup>
import {useStore} from "vuex";
import {computed, ref, watch} from "vue";
import TeamService from "@/services/team/team.service.js";
import Loading from "@/components/error/Loading.vue";
import SeasonSelector from "@/components/helper/SeasonSelector.vue";

const store = useStore();
const selectedTeamId = computed(() => store.getters.selectedTeamId);
const team = ref(null);
const opponent = ref(null);
const seasons = ref([]);
const selectedSeason = ref('all');
const all = ref('all');
const fetchTeamData = async (id, season = null) => {
  try {
    if (id) {
      if(season != null){
        team.value = await TeamService.fetchTeamWithStatsTotals(id, season);
      }
      else{
        team.value = await TeamService.fetchTeamWithStatsTotals(id, 'all');
      }
    } else {
      team.value = null;
    }
  } catch (error) {
    console.error("Error while fetching team with stat totals: ", error);
  }
};

const fetchTeamOpponentData = async (id, season = null) => {
  try {
    if(id){
      if(season != null){
        opponent.value = await TeamService.fetchOpponentWithStatsTotals(id, season);
      }
      else{
        opponent.value = await TeamService.fetchOpponentWithStatsTotals(id, 'all');
      }
    }
    else{
      opponent.value = null;
    }
  } catch (error){
    console.log("Error while fetching team opponent with stat totals ", error);
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
  fetchTeamData(newId);
  fetchTeamOpponentData(newId);
  fetchSeasons(newId);
});

watch(selectedSeason, (newSeason) => {
  fetchTeamData(selectedTeamId.value, newSeason);
  fetchTeamOpponentData(selectedTeamId.value, newSeason);
});

fetchTeamData(selectedTeamId.value);
fetchTeamOpponentData(selectedTeamId.value);
fetchSeasons(selectedTeamId.value);

</script>

<template>
  <div class="container shadow-lg">
    <div class="d-flex">
      <div class="col-md-4 d-flex align-items-center">
        <SeasonSelector :selected-season="selectedSeason" :seasons="seasons" @updateSelectedSeason="selectedSeason = $event"></SeasonSelector>
      </div>
      <div class="col-md-4 d-flex justify-content-center">
        <h5 class="mt-2">Totals</h5>
      </div>
      <div class="col-md-4">

      </div>
    </div>
    <hr class="my-2">
    <template v-if="team !== null && opponent !== null">
      <table class="table table-striped table-hover table-bordered small-text">
        <thead>
        <tr>
          <th scope="col">Team</th>
          <th scope="col">M</th>
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
        <tr>
          <td>{{ team.name }}</td>
          <td>{{ team.numberOfGames }}</td>
          <td>{{team.totalPoints}}</td>
          <td>{{team.twoPointShotsMade}} / {{team.twoPointShotsAttempted}}</td>
          <td>{{team.threePointShotsMade}} / {{team.threePointShotsAttempted}}</td>
          <td>{{team.freeThrowsMade}} / {{team.freeThrowsAttempted}}</td>
          <td>{{team.twoPointShotsMade + team.threePointShotsMade}} / {{team.twoPointShotsAttempted + team.threePointShotsAttempted}}</td>
          <td>{{team.offRebounds}}</td>
          <td>{{team.defRebounds}}</td>
          <td>{{team.assists}}</td>
          <td>{{team.fouls}}</td>
          <td>{{team.forcedFouls}}</td>
          <td>{{team.turnOvers}}</td>
          <td>{{team.steals}}</td>
          <td>{{team.blocks}}</td>
          <td>{{team.blocksReceived}}</td>
          <td>{{team.possessions}}</td>
          <td>{{team.evaluation}}</td>
        </tr>
        <tr>
          <td>{{opponent.name}}</td>
          <td>{{opponent.numberOfGames}}</td>
          <td>{{opponent.totalPoints}}</td>
          <td>{{opponent.twoPointShotsMade}} / {{opponent.twoPointShotsAttempted}}</td>
          <td>{{opponent.threePointShotsMade}} / {{opponent.threePointShotsAttempted}}</td>
          <td>{{opponent.freeThrowsMade}} / {{opponent.freeThrowsAttempted}}</td>
          <td>{{opponent.twoPointShotsMade + opponent.threePointShotsMade}} / {{opponent.twoPointShotsAttempted + opponent.threePointShotsAttempted}}</td>
          <td>{{opponent.offRebounds}}</td>
          <td>{{opponent.defRebounds}}</td>
          <td>{{opponent.assists}}</td>
          <td>{{opponent.fouls}}</td>
          <td>{{opponent.forcedFouls}}</td>
          <td>{{opponent.turnOvers}}</td>
          <td>{{opponent.steals}}</td>
          <td>{{opponent.blocks}}</td>
          <td>{{opponent.blocksReceived}}</td>
          <td>{{opponent.possessions}}</td>
          <td>{{opponent.evaluation}}</td>
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
          <th scope="col">Team</th>
          <th scope="col">M</th>
          <th scope="col">Pts</th>
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
        <tr>
          <td>{{ team.name }}</td>
          <td>{{ team.numberOfGames }}</td>
          <td>{{team.stats.averagePoints}}</td>
          <td>{{team.stats.twoPointPercentage}}</td>
          <td>{{team.stats.threePointPercentage}}</td>
          <td>{{team.stats.freeThrowPercentage}}</td>
          <td>{{team.stats.fieldGoalPercentage}}</td>
          <td>{{team.stats.averageOffRebounds}}</td>
          <td>{{team.stats.averageDefRebounds}}</td>
          <td>{{team.stats.averageAssists}}</td>
          <td>{{team.stats.averageFouls}}</td>
          <td>{{team.stats.averageForcedFouls}}</td>
          <td>{{team.stats.averageTurnovers}}</td>
          <td>{{team.stats.averageSteals}}</td>
          <td>{{team.stats.averageBlocks}}</td>
          <td>{{team.stats.averageBlocksReceived}}</td>
          <td>{{team.stats.averagePossessions}}</td>
          <td>{{team.stats.averageEval}}</td>
        </tr>
        <tr>
          <td>{{opponent.name}}</td>
          <td>{{ opponent.numberOfGames }}</td>
          <td>{{opponent.stats.averagePoints}}</td>
          <td>{{opponent.stats.twoPointPercentage}}</td>
          <td>{{opponent.stats.threePointPercentage}}</td>
          <td>{{opponent.stats.freeThrowPercentage}}</td>
          <td>{{opponent.stats.fieldGoalPercentage}}</td>
          <td>{{opponent.stats.averageOffRebounds}}</td>
          <td>{{opponent.stats.averageDefRebounds}}</td>
          <td>{{opponent.stats.averageAssists}}</td>
          <td>{{opponent.stats.averageFouls}}</td>
          <td>{{opponent.stats.averageForcedFouls}}</td>
          <td>{{opponent.stats.averageTurnovers}}</td>
          <td>{{opponent.stats.averageSteals}}</td>
          <td>{{opponent.stats.averageBlocks}}</td>
          <td>{{opponent.stats.averageBlocksReceived}}</td>
          <td>{{opponent.stats.averagePossessions}}</td>
          <td>{{opponent.stats.averageEval}}</td>
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
td, th {
  text-align: center;
}
</style>
