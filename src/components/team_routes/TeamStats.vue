<script setup>
import {useStore} from "vuex";
import {computed, ref, watch} from "vue";
import TeamService from "@/services/team/team.service.js";

const store = useStore();
const selectedTeamId = computed(() => store.getters.selectedTeamId);
const team = ref(null);
const fetchTeamData = async (id) => {
  try {
    if (id) {
      team.value = await TeamService.fetchTeamWithStatTotals(id);
    } else {
      team.value = null;
    }
  } catch (error) {
    console.error("Error while fetching team with stat totals: ", error);
  }
};

watch(selectedTeamId, (newId) => {
  fetchTeamData(newId);
});
fetchTeamData(selectedTeamId.value);

const fieldGoalsAttempted = computed(()=>{
  return team.value.twoPointShotsAttempted + team.value.threePointShotsAttempted;
});
const fieldGoalMade = computed(()=>{
  return team.value.twoPointShotsMade + team.value.threePointShotsMade;
});
const twoPointPercentage = computed(()=>{
  return team.value.twoPointShotsMade / team.value.twoPointShotsAttempted * 100;
});
const threePointPercentage = computed(()=>{
  return team.value.threePointShotsMade / team.value.threePointShotsAttempted * 100;
});
const fieldGoalPercentage = computed(()=>{
  return fieldGoalMade.value / fieldGoalsAttempted.value * 100;
});
const freeThrowPercentage = computed(()=>{
  return team.value.freeThrowMade / team.value.freeThrowAttempted * 100;
});


const averagePoints = computed(()=>{
  return team.value.totalPoints / team.value.numberOfGames;
});
const averageOffRebounds = computed(()=>{
  return team.value.offRebounds / team.value.numberOfGames;
});
const averageDefRebounds = computed(()=>{
  return team.value.defRebounds / team.value.numberOfGames;
});
const averageAssists = computed(()=>{
  return team.value.assists / team.value.numberOfGames;
});
const averageFouls = computed(()=>{
  return team.value.fouls / team.value.numberOfGames;
});
const averageForcedFouls = computed(()=>{
  return team.value.forcedFouls / team.value.numberOfGames;
});
const averageTurnovers = computed(()=>{
  return team.value.turnOvers / team.value.numberOfGames;
});
const averageSteals = computed(()=>{
  return team.value.steals / team.value.numberOfGames;
});
const averageBlocks = computed(()=>{
  return team.value.blocks / team.value.numberOfGames;
});
const averageBlocksReceived = computed(()=>{
  return team.value.blocksReceived / team.value.numberOfGames;
});
const averageEval = computed(()=>{
  return team.value.eval / team.value.numberOfGames;
});

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
          <th scope="col">Eval</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{ team.name }}</td>
          <td>{{ team.numberOfGames }}</td>
          <td>{{team.totalPoints}}</td>
          <td>{{team.twoPointShotsAttempted}} / {{team.twoPointShotsMade}}</td>
          <td>{{team.threePointShotsAttempted}} / {{team.threePointShotsMade}}</td>
          <td>{{team.freeThrowsAttempted}} / {{team.freeThrowsMade}}</td>
          <td>{{fieldGoalsAttempted}} / {{fieldGoalMade}}</td>
          <td>{{team.offRebounds}}</td>
          <td>{{team.defRebounds}}</td>
          <td>{{team.assists}}</td>
          <td>{{team.fouls}}</td>
          <td>{{team.forcedFouls}}</td>
          <td>{{team.turnOvers}}</td>
          <td>{{team.steals}}</td>
          <td>{{team.blocks}}</td>
          <td>{{team.blocksReceived}}</td>
          <td>{{team.eval}}</td>
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
          <th scope="col">Eval</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{ team.name }}</td>
          <td>{{ team.numberOfGames }}</td>
          <td>{{averagePoints}}</td>
          <td>{{twoPointPercentage}}</td>
          <td>{{threePointPercentage}}</td>
          <td>{{freeThrowPercentage}}</td>
          <td>{{fieldGoalPercentage}}</td>
          <td>{{averageOffRebounds}}</td>
          <td>{{averageDefRebounds}}</td>
          <td>{{averageAssists}}</td>
          <td>{{averageFouls}}</td>
          <td>{{averageForcedFouls}}</td>
          <td>{{averageTurnovers}}</td>
          <td>{{averageSteals}}</td>
          <td>{{averageBlocks}}</td>
          <td>{{averageBlocksReceived}}</td>
          <td>{{averageEval}}</td>
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
