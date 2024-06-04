<script setup>
import {useStore} from "vuex";
import {computed, ref, watch} from "vue";
import TeamService from "@/services/team/team.service.js";
import Loading from "@/components/error/Loading.vue";
import SeasonSelector from "@/components/helper/SeasonSelector.vue";

const store = useStore();
const selectedTeamId = computed(() => store.getters.selectedTeamId);
const teamWithRecords = ref(null);
const seasons = ref([]);
const selectedSeason = ref('all');
const all = ref('all');

const fetchTeamRecords = async (id, season = null) => {
  try{
    if(id){
      if(season != null){
        teamWithRecords.value = await TeamService.fetchTeamWithRecords(id, season);
      }
      else{
        teamWithRecords.value = await TeamService.fetchTeamWithRecords(id, 'all');
      }
    }
    else{
      teamWithRecords.value = null;
    }
  } catch (error){
    console.error("Error while fetching team records: ", error);
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

watch(selectedSeason, (newSeason) => {
  fetchTeamRecords(selectedTeamId.value, newSeason);
});
watch(selectedTeamId, (newId) => {
  fetchTeamRecords(newId);
});
fetchTeamRecords(selectedTeamId.value);
fetchSeasons(selectedTeamId.value);

</script>

<template>
  <div class="container shadow-lg" >
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
    <template v-if="teamWithRecords !== null">
      <table class="table table-striped table-hover table-bordered small-text ">
        <thead>
        <tr>
          <th scope="col">Record</th>
          <th scope="col">Value</th>
          <th scope="col">Date</th>
          <th scope="col">Opponent</th>
          <th scope="col">Score</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="record in teamWithRecords.records">
          <td>{{ record.name }}</td>
          <td>{{ record.value }}</td>
          <td>{{ record.date }}</td>
          <td>{{ record.opponent }}</td>
          <td>{{ record.score }}</td>
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
