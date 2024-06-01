<script setup>

import {useStore} from "vuex";
import {computed, ref, watch} from "vue";
import Loading from "@/components/error/Loading.vue";
import TeamService from "@/services/team/team.service.js";

const store = useStore();
const selectedTeamId = computed(()=>store.getters.selectedTeamId);
const team = ref(null);

const fetchTeam = async (id) => {
  try{
    if(id){
      team.value = await TeamService.fetchTeamWithPlayers(id);
    }
    else{
      team.value = null;
    }
  }catch (error) {
    console.error("Error while fetching team with current players: ", error);
  }
}

watch(selectedTeamId, (newId) => {
  fetchTeam(newId);
});
fetchTeam(selectedTeamId.value);

</script>

<template>
  <div>
    <template v-if="team !== null">
      <div class="container mt-4 shadow-lg">
        <div class="d-flex justify-content-center">
          <h5 class="mt-2">Edit team</h5>
        </div>
        <div class="d-flex">
          <div class="col-md-3">
<!--            <input type="hidden" v-model="team.id">-->
<!--            <input class="form-control form-control-sm" v-model="team.name">-->
<!--            <input v-model="team.location">-->
<!--            <input v-model="team.arena">-->
<!--            <input v-model="team.address">-->
          </div>
          <div class="col-md-9">
            <table class="table table-hover table-bordered small-text">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First name</th>
                <th scope="col">Last name</th>
                <th scope="col">Height</th>
                <th scope="col">Weight</th>
                <th scope="col">Position</th>
                <th scope="col">Birth</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(player, index) in team.currentPlayers" :key="player.id">
                <th scope="row">{{ index + 1 }}</th>
                <td class="text-center">
                  <input class="small-text custom-input" v-model="player.lastName">
                </td>
                <td class="text-center">
                  <input class="small-text custom-input" v-model="player.firstName">
                </td>
                <td class="text-center">
                  <input class="small-text custom-input" v-model="player.height">
                </td>
                <td class="text-center">
                  <input class="small-text custom-input" v-model="player.weight">
                </td>
                <td class="text-center">
                  <input class="small-text custom-input" v-model="player.position">
                </td>
                <td class="text-center">
                  <input class="small-text custom-input" v-model="player.birth">
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </template>
    <template v-else>
      <Loading></Loading>
    </template>
  </div>
</template>

<style scoped>
.custom-input:focus {
  color: #495057;
  background-color: #fff;
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
.custom-input{
  display: block;
  padding: 0.375rem 0.75rem;
  line-height: 1.5;
  width: 100%;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
</style>
