<script setup>
import {useStore} from "vuex";
import {computed, ref, watch} from "vue";
import TeamService from "@/services/team/team.service.js";

const store = useStore();
const selectedTeamId = computed(() => store.getters.selectedTeamId);
const teamWithPlayerStatsTotals = ref(null);

const fetchTeamWithPlayerStatsTotals = async (id) => {
  try{
    if(id){
      teamWithPlayerStatsTotals.value = await TeamService.fetchTeamWithPlayerStatsTotals(id);
    }
  }catch (error) {
    console.error("Error while fetching team with player stats totals: ", error);
  }
}

watch(selectedTeamId, (newId) => {
  fetchTeamWithPlayerStatsTotals(newId);
});
fetchTeamWithPlayerStatsTotals(selectedTeamId.value);


</script>


<template>
  <div>
    <template v-if="teamWithPlayerStatsTotals !== null">
      <div class="d-flex justify-content-center mt-2">
        <h5>Totals</h5>
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

    </template>
  </div>
</template>

<style scoped>
td, th{
  text-align: center;
}
</style>
