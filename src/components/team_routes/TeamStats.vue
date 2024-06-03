<script setup>
import {useStore} from "vuex";
import {computed, ref, watch} from "vue";
import TeamService from "@/services/team/team.service.js";
import Loading from "@/components/error/Loading.vue";

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
      if (seasons.value.length > 0) {
        // selectedSeason.value = all.value;
      }
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

const calculatePercentage = (made, attempted) => {
  return attempted > 0 ? (made / attempted) * 100 : 0;
};

const calculateAverage = (total, games) => {
  return parseFloat((games > 0 ? total / games : 0).toFixed(2));
};
const createStatsComputed = (entity) => {
  return {
    fieldGoalsAttempted: computed(() => entity.value.twoPointShotsAttempted + entity.value.threePointShotsAttempted),
    fieldGoalsMade: computed(() => entity.value.twoPointShotsMade + entity.value.threePointShotsMade),
    twoPointPercentage: computed(() => parseFloat(calculatePercentage(entity.value.twoPointShotsMade, entity.value.twoPointShotsAttempted).toFixed(2))),
    threePointPercentage: computed(() => parseFloat(calculatePercentage(entity.value.threePointShotsMade, entity.value.threePointShotsAttempted).toFixed(2))),
    fieldGoalPercentage: computed(() => parseFloat(calculatePercentage(entity.value.twoPointShotsMade + entity.value.threePointShotsMade, entity.value.twoPointShotsAttempted + entity.value.threePointShotsAttempted).toFixed(2))),
    freeThrowPercentage: computed(() => parseFloat(calculatePercentage(entity.value.freeThrowsMade, entity.value.freeThrowsAttempted).toFixed(2))),
    averagePoints: computed(() => calculateAverage(entity.value.totalPoints, entity.value.numberOfGames)),
    averageOffRebounds: computed(() => calculateAverage(entity.value.offRebounds, entity.value.numberOfGames)),
    averageDefRebounds: computed(() => calculateAverage(entity.value.defRebounds, entity.value.numberOfGames)),
    averageAssists: computed(() => calculateAverage(entity.value.assists, entity.value.numberOfGames)),
    averageFouls: computed(() => calculateAverage(entity.value.fouls, entity.value.numberOfGames)),
    averageForcedFouls: computed(() => calculateAverage(entity.value.forcedFouls, entity.value.numberOfGames)),
    averageTurnovers: computed(() => calculateAverage(entity.value.turnOvers, entity.value.numberOfGames)),
    averageSteals: computed(() => calculateAverage(entity.value.steals, entity.value.numberOfGames)),
    averageBlocks: computed(() => calculateAverage(entity.value.blocks, entity.value.numberOfGames)),
    averageBlocksReceived: computed(() => calculateAverage(entity.value.blocksReceived, entity.value.numberOfGames)),
    averagePossessions: computed(() => calculateAverage(entity.value.possessions, entity.value.numberOfGames)),
    averageEval: computed(() => calculateAverage(entity.value.evaluation, entity.value.numberOfGames)),
  };
};

const teamStats = createStatsComputed(team);
const opponentStats = createStatsComputed(opponent);

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
          <td>{{teamStats.fieldGoalsMade}} / {{teamStats.fieldGoalsAttempted}}</td>
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
          <td>{{opponentStats.fieldGoalsMade}} / {{opponentStats.fieldGoalsAttempted}}</td>
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
          <td>{{teamStats.averagePoints}}</td>
          <td>{{teamStats.twoPointPercentage}}</td>
          <td>{{teamStats.threePointPercentage}}</td>
          <td>{{teamStats.freeThrowPercentage}}</td>
          <td>{{teamStats.fieldGoalPercentage}}</td>
          <td>{{teamStats.averageOffRebounds}}</td>
          <td>{{teamStats.averageDefRebounds}}</td>
          <td>{{teamStats.averageAssists}}</td>
          <td>{{teamStats.averageFouls}}</td>
          <td>{{teamStats.averageForcedFouls}}</td>
          <td>{{teamStats.averageTurnovers}}</td>
          <td>{{teamStats.averageSteals}}</td>
          <td>{{teamStats.averageBlocks}}</td>
          <td>{{teamStats.averageBlocksReceived}}</td>
          <td>{{teamStats.averagePossessions}}</td>
          <td>{{teamStats.averageEval}}</td>
        </tr>
        <tr>
          <td>{{opponent.name}}</td>
          <td>{{ opponent.numberOfGames }}</td>
          <td>{{opponentStats.averagePoints}}</td>
          <td>{{opponentStats.twoPointPercentage}}</td>
          <td>{{opponentStats.threePointPercentage}}</td>
          <td>{{opponentStats.freeThrowPercentage}}</td>
          <td>{{opponentStats.fieldGoalPercentage}}</td>
          <td>{{opponentStats.averageOffRebounds}}</td>
          <td>{{opponentStats.averageDefRebounds}}</td>
          <td>{{opponentStats.averageAssists}}</td>
          <td>{{opponentStats.averageFouls}}</td>
          <td>{{opponentStats.averageForcedFouls}}</td>
          <td>{{opponentStats.averageTurnovers}}</td>
          <td>{{opponentStats.averageSteals}}</td>
          <td>{{opponentStats.averageBlocks}}</td>
          <td>{{opponentStats.averageBlocksReceived}}</td>
          <td>{{opponentStats.averagePossessions}}</td>
          <td>{{opponentStats.averageEval}}</td>
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
