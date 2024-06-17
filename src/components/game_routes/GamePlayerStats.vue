<script setup>
import Loading from "@/components/error/Loading.vue";
import {useStore} from "vuex";
import {computed, ref, watch} from "vue";
import GameService from "@/services/game/game.service.js";

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
  <div class="container shadow-lg">
    <template v-if="game !== null">
      <div class="d-flex justify-content-center">
        <h5 class="mt-2">{{game.home.name}}</h5>
      </div>
      <hr class="my-2">
      <table class="table table-striped table-hover table-bordered small-text text-center">
        <thead>
        <tr>
          <th scope="col">No.</th>
          <th scope="col">Player</th>
          <th scope="col">S5</th>
          <th scope="col">PTS</th>
          <th scope="col" colspan="2">2PT</th>
          <th scope="col" colspan="2">3PT</th>
          <th scope="col" colspan="2">FT</th>
          <th scope="col" colspan="2">FG</th>
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
        <tr v-for="player in game.home.players">
          <td>{{player.shirtNumber}}</td>
          <td>{{player.firstName +  ' ' + player.lastName}}</td>
          <td>{{ player.startingFive ? '1' : '0' }}</td>
          <td>{{player.statLine.totalPoints}}</td>
          <td>{{player.statLine.twoMade}} / {{player.statLine.twoAttempted}}</td>
          <td>{{player.statLine.percentage.twoPoint}} %</td>
          <td>{{player.statLine.threeMade}} / {{player.statLine.threeAttempted}}</td>
          <td>{{player.statLine.percentage.threePoint}} % </td>
          <td>{{player.statLine.freeThrowMade}} / {{player.statLine.freeThrowAttempted}}</td>
          <td>{{player.statLine.percentage.freeThrow}} %</td>
          <td>{{player.statLine.twoMade + player.statLine.threeMade}} / {{player.statLine.twoAttempted + player.statLine.threeAttempted}}</td>
          <td>{{player.statLine.percentage.fieldGoal}} %</td>
          <td>{{player.statLine.offRebounds}}</td>
          <td>{{player.statLine.defRebounds}}</td>
          <td>{{player.statLine.assists}}</td>
          <td>{{player.statLine.fouls}}</td>
          <td>{{player.statLine.forcedFouls}}</td>
          <td>{{player.statLine.turnovers}}</td>
          <td>{{player.statLine.steals}}</td>
          <td>{{player.statLine.blocks}}</td>
          <td>{{player.statLine.blocksReceived}}</td>
          <td>{{player.statLine.possessions}}</td>
          <td>{{player.statLine.evaluation}}</td>
        </tr>
        </tbody>
      </table>

      <div class="d-flex justify-content-center mt-2">
        <h5>{{ game.away.name }}</h5>
      </div>
      <hr class="my-2">
      <table class="table table-striped table-hover table-bordered small-text text-center">
        <thead>
        <tr>
          <th scope="col">No.</th>
          <th scope="col">Player</th>
          <th scope="col">S5</th>
          <th scope="col">PTS</th>
          <th scope="col" colspan="2">2PT</th>
          <th scope="col" colspan="2">3PT</th>
          <th scope="col" colspan="2">FT</th>
          <th scope="col" colspan="2">FG</th>
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
        <tr v-for="player in game.away.players">
          <td>{{player.shirtNumber}}</td>
          <td>{{player.firstName +  ' ' + player.lastName}}</td>
          <td>{{ player.startingFive ? '1' : '0' }}</td>
          <td>{{player.statLine.totalPoints}}</td>
          <td>{{player.statLine.twoMade}} / {{player.statLine.twoAttempted}}</td>
          <td>{{player.statLine.percentage.twoPoint}} %</td>
          <td>{{player.statLine.threeMade}} / {{player.statLine.threeAttempted}}</td>
          <td>{{player.statLine.percentage.threePoint}} % </td>
          <td>{{player.statLine.freeThrowMade}} / {{player.statLine.freeThrowAttempted}}</td>
          <td>{{player.statLine.percentage.freeThrow}} %</td>
          <td>{{player.statLine.twoMade + player.statLine.threeMade}} / {{player.statLine.twoAttempted + player.statLine.threeAttempted}}</td>
          <td>{{player.statLine.percentage.fieldGoal}} %</td>
          <td>{{player.statLine.offRebounds}}</td>
          <td>{{player.statLine.defRebounds}}</td>
          <td>{{player.statLine.assists}}</td>
          <td>{{player.statLine.fouls}}</td>
          <td>{{player.statLine.forcedFouls}}</td>
          <td>{{player.statLine.turnovers}}</td>
          <td>{{player.statLine.steals}}</td>
          <td>{{player.statLine.blocks}}</td>
          <td>{{player.statLine.blocksReceived}}</td>
          <td>{{player.statLine.possessions}}</td>
          <td>{{player.statLine.evaluation}}</td>
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
