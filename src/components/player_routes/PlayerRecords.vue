<script setup>
import {computed, ref, watch} from "vue";
import {useStore} from "vuex";
import PlayerService from "@/services/player/player.service.js";
import SeasonSelector from "@/components/helper/SeasonSelector.vue";
import TeamService from "@/services/team/team.service.js";

const records = ref([]);
const store = useStore();
const selectedPlayerId = computed(() => store.getters.selectedPlayerId);
const seasons = ref([]);
const selectedSeason = ref('all');
const all = ref('all');
const fetchPlayerRecords = async (id, season = null) => {
  try{
    if(id){
      if(season != null){
        records.value = await PlayerService.fetchPlayerRecords(id, season);
      }
      else{
        records.value = await PlayerService.fetchPlayerRecords(id, 'all');
      }
    }
  }catch (error) {
    console.error("Error while fetching player records: " , error);
  }
};
const fetchSeasons = async (id) => {
  try{
    if(id){
      seasons.value = await PlayerService.fetchPossibleSeasonsFromPlayer(id);
    }
    else{
      seasons.value = [];
    }
  }catch (error){
    console.error("Error while fetching possible seasons");
  }
};

watch(selectedPlayerId, (newId) => {
  fetchPlayerRecords(newId);
});
watch(selectedSeason, (newSeason) => {
  fetchPlayerRecords(selectedPlayerId.value, newSeason);
});
fetchPlayerRecords(selectedPlayerId.value);
fetchSeasons(selectedPlayerId.value);
</script>

<template>
  <div>
    <div class="container shadow-lg">
      <div class="d-flex">
        <div class="col-md-4 d-flex align-items-center">
          <SeasonSelector :selected-season="selectedSeason" :seasons="seasons" @updateSelectedSeason="selectedSeason = $event"></SeasonSelector>
        </div>
        <div class="col-md-4 d-flex justify-content-center">
          <h5 class="mt-2">Records</h5>
        </div>
        <div class="col-md-4">

        </div>
      </div>
      <hr class="my-2">
      <template v-if="records !== null">
        <table class="table table-striped table-hover table-bordered small-text text-center">
          <thead>
          <tr>
            <th scope="col">Record</th>
            <th scope="col">Value</th>
            <th scope="col">Player</th>
            <th scope="col">Date</th>
            <th scope="col">Opponent</th>
            <th scope="col">Score</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="record in records">
            <td>{{record.name}}</td>
            <td>{{record.value}}</td>
            <td>{{record.playerFullName}}</td>
            <td>{{record.date}}</td>
            <td>{{record.opponent}}</td>
            <td>{{record.score}}</td>
          </tr>
          </tbody>
        </table>

      </template>
      <template v-else>
        <Loading></Loading>
      </template>
      <div style="height: 1px"></div>
    </div>
  </div>
</template>

<style scoped>

</style>
