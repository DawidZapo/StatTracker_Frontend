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

      <div class="container mt-4">
        <table class="table table-striped table-hover table-bordered small-text text-center">
          <thead>
          <tr>
            <th scope="col">Team</th>
            <th scope="col">PTS</th>
            <th scope="col">2PT</th>
            <th scope="col">2PT %</th>
            <th scope="col">3PT</th>
            <th scope="col">3PT %</th>
            <th scope="col">FT</th>
            <th scope="col">FT %</th>
            <th scope="col">FG</th>
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
            <td>{{game.home.name}}</td>
            <td>{{game.home.statLine.totalPoints}}</td>
            <td>{{game.home.statLine.twoMade}} / {{game.home.statLine.twoAttempted}}</td>
            <td>{{game.home.percentage.twoPoint}}</td>
            <td>{{game.home.statLine.threeMade}} / {{game.home.statLine.threeAttempted}}</td>
            <td>{{game.home.percentage.threePoint}}</td>
            <td>{{game.home.statLine.freeThrowMade}} / {{game.home.statLine.freeThrowAttempted}}</td>
            <td>{{game.home.percentage.freeThrow}}</td>
            <td>{{game.home.statLine.twoMade + game.home.statLine.threeMade}} / {{game.home.statLine.twoAttempted + game.home.statLine.threeAttempted}}</td>
            <td>{{game.home.percentage.fieldGoal}}</td>
            <td>{{game.home.statLine.offRebounds}}</td>
            <td>{{game.home.statLine.defRebounds}}</td>
            <td>{{game.home.statLine.assists}}</td>
            <td>{{game.home.statLine.fouls}}</td>
            <td>{{game.home.statLine.forcedFouls}}</td>
            <td>{{game.home.statLine.turnovers}}</td>
            <td>{{game.home.statLine.steals}}</td>
            <td>{{game.home.statLine.blocks}}</td>
            <td>{{game.home.statLine.blocksReceived}}</td>
            <td>{{game.home.statLine.possessions}}</td>
            <td>{{game.home.statLine.evaluation}}</td>
          </tr>
          <tr>
            <td>{{game.away.name}}</td>
            <td>{{game.away.statLine.totalPoints}}</td>
            <td>{{game.away.statLine.twoMade}} / {{game.away.statLine.twoAttempted}}</td>
            <td>{{game.away.percentage.twoPoint}}</td>
            <td>{{game.away.statLine.threeMade}} / {{game.away.statLine.threeAttempted}}</td>
            <td>{{game.away.percentage.threePoint}}</td>
            <td>{{game.away.statLine.freeThrowMade}} / {{game.away.statLine.freeThrowAttempted}}</td>
            <td>{{game.away.percentage.freeThrow}}</td>
            <td>{{game.away.statLine.twoMade + game.away.statLine.threeMade}} / {{game.away.statLine.twoAttempted + game.away.statLine.threeAttempted}}</td>
            <td>{{game.away.percentage.fieldGoal}}</td>
            <td>{{game.away.statLine.offRebounds}}</td>
            <td>{{game.away.statLine.defRebounds}}</td>
            <td>{{game.away.statLine.assists}}</td>
            <td>{{game.away.statLine.fouls}}</td>
            <td>{{game.away.statLine.forcedFouls}}</td>
            <td>{{game.away.statLine.turnovers}}</td>
            <td>{{game.away.statLine.steals}}</td>
            <td>{{game.away.statLine.blocks}}</td>
            <td>{{game.away.statLine.blocksReceived}}</td>
            <td>{{game.away.statLine.possessions}}</td>
            <td>{{game.away.statLine.evaluation}}</td>
          </tr>
          </tbody>
        </table>
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
