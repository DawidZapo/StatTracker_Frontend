<script setup>
import {useStore} from "vuex";
import {computed, ref, watch} from "vue";
import TeamService from "@/services/team/team.service.js";
import Loading from "@/components/error/Loading.vue";

const store = useStore();
const selectedTeamId = computed(() => store.getters.selectedTeamId);
const teamWithRecords = ref(null);

const fetchTeamRecords = async (id) => {
  try{
    if(id){
      teamWithRecords.value = await TeamService.fetchTeamWithRecords(id);
    }
    else{
      teamWithRecords.value = null;
    }
  } catch (error){
    console.error("Error while fetching team records: ", error);
  }
};

watch(selectedTeamId, (newId) => {
  fetchTeamRecords(newId);
});
fetchTeamRecords(selectedTeamId.value);

</script>

<template>
  <div>
    <template v-if="teamWithRecords !== null">
      <div class="d-flex justify-content-center mt-2">
        <h5>Records</h5>
      </div>
      <hr class="my-2">
      <table class="table table-striped table-hover table-bordered small-text">
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

  </div>
</template>

<style scoped>
td, th {
  text-align: center;
}
</style>
