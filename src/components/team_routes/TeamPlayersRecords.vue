<script setup>
import {useStore} from "vuex";
import {computed, ref, watch} from "vue";
import TeamService from "@/services/team/team.service.js";
import Loading from "@/components/error/Loading.vue";

const store = useStore();
const selectedTeamId = computed(() => store.getters.selectedTeamId);
const teamWithPlayerRecords = ref(null);

const fetchTeamWithPlayerRecords = async (id) => {
  try{
    if(id){
      teamWithPlayerRecords.value = await TeamService.fetchTeamWithRecords(id, true);
    }
    else{
      teamWithPlayerRecords.value = null;
    }
  }catch (error) {
    console.error("Error while fetching team with player records: ", error);
  }
}

watch(selectedTeamId, (newId) => {
  fetchTeamWithPlayerRecords(newId);
});
fetchTeamWithPlayerRecords(selectedTeamId.value);
</script>

<template>
  <div class="container shadow-lg">
    <div class="d-flex justify-content-center">
      <h5 class="mt-2">Players' records</h5>
    </div>
    <hr class="my-2">
    <template v-if="teamWithPlayerRecords != null">
      <table class="table table-striped table-hover table-bordered small-text">
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
        <tr v-for="record in teamWithPlayerRecords.records">
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
</template>

<style scoped>
th, td{
  text-align: center;
}
</style>
