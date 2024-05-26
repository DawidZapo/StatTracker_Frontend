<script setup>
import {useStore} from "vuex";
import {computed, ref, watch} from "vue";
import TeamService from "@/services/team/team.service.js";

const store = useStore();
const selectedTeamId = computed(() => store.getters.selectedTeamId);
const team = ref(null);
const opponent = ref(null);
const fetchTeamData = async (id) => {
  try {
    if (id) {
      team.value = await TeamService.fetchTeamWithStatsTotals(id);
    } else {
      team.value = null;
    }
  } catch (error) {
    console.error("Error while fetching team with stat totals: ", error);
  }
};

const fetchTeamOpponentData = async (id) => {
  try {
    if(id){
      opponent.value = await TeamService.fetchTeamWithStatsTotals(id, true);
    }
    else{
      opponent.value = null;
    }
  } catch (error){
    console.log("Error while fetching team opponent with stat totals ", error);
  }
};

watch(selectedTeamId, (newId) => {
  fetchTeamData(newId);
  fetchTeamOpponentData(newId);
});
fetchTeamData(selectedTeamId.value);
fetchTeamOpponentData(selectedTeamId.value);

const calculatePercentage = (made, attempted) => {
  return attempted > 0 ? (made / attempted) * 100 : 0;
};

const calculateAverage = (total, games) => {
  return games > 0 ? total / games : 0;
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
    averageEval: computed(() => calculateAverage(entity.value.eval, entity.value.numberOfGames)),
  };
};

const teamStats = createStatsComputed(team);
const opponentStats = createStatsComputed(opponent);

</script>

<template>
  <div>
    <template v-if="team != null">
      <h5>Totals</h5>
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
          <td>{{team.eval}}</td>
        </tr>
        <tr>
          <td>{{ opponent.name }}</td>
          <td>{{ opponent.numberOfGames }}</td>
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
          <td>{{opponent.eval}}</td>
        </tr>
        </tbody>
      </table>

      <h5>Averages</h5>
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
          <td>{{ opponent.name }}</td>
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
  </div>
</template>

<style scoped>
td, th {
  text-align: center;
}
</style>
