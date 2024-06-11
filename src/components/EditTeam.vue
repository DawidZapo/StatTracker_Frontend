<script setup>

import {useStore} from "vuex";
import {computed, ref, watch} from "vue";
import Loading from "@/components/error/Loading.vue";
import TeamService from "@/services/team/team.service.js";
import PlayerService from "@/services/player/player.service.js";

const store = useStore();
const selectedTeamId = computed(()=>store.getters.selectedTeamId);
const team = ref(null);
const positions = ref(['POINT_GUARD', 'SHOOTING_GUARD', 'SMALL_FORWARD', 'POWER_FORWARD', 'CENTER']);
const submitResponse = ref('');
const submitSuccess = ref(true);

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

const handleSubmit = async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  try{
    submitResponse.value = await TeamService.saveTeamWithPlayersDto(team.value);
    submitSuccess.value = true;

  }catch (error) {
    console.error("Error while saving team: ", error);
    submitResponse.value = 'Error while saving team';
    submitSuccess.value = false;
  }
};

const confirmRemovePlayer = (player) => {
  if (confirm("Do you really want to delete this player from the team?")) {
    removePlayer(player);
  }
};

const removePlayer = async (player) => {
  window.scrollTo({top: 0, behavior: 'smooth'});
  try{
    submitResponse.value = await PlayerService.removePlayerFromTeam(player);
    submitSuccess.value = true;

    const indexToRemove = team.value.currentPlayers.findIndex(playerInTeam => playerInTeam.id === player.id);
    team.value.currentPlayers.splice(indexToRemove, 1);


  }catch (error) {
    console.error("Error while removing player from team: ", error);
    submitResponse.value = 'Error while removing player from team';
    submitSuccess.value = false;
  }
};

</script>

<template>
  <div>
    <template v-if="team !== null">
      <div v-if="submitResponse !== '' ">
        <div style="height: auto; line-height: 0.1;" :class="['alert', 'text-center' ,submitSuccess === true ? 'alert-success' : 'alert-danger']">
          {{submitResponse}}
        </div>
      </div>
      <form @submit.prevent="handleSubmit" class="container shadow-lg">
        <div class="d-flex justify-content-center">
          <h5 class="mt-2">Edit team</h5>
        </div>
        <hr class="my-2">
        <div class="d-flex mt-3">
          <div class="col-md-3">
            <input type="hidden" v-model="team.id">

            <div class="container">
              <h6 class="mx-1">Name</h6>
              <input class="small-text custom-input" v-model="team.name">
            </div>

            <div class="container mt-3">
              <h6 class="mx-1">Location</h6>
              <input class="small-text custom-input" v-model="team.location">
            </div>

            <div class="container mt-3">
              <h6 class="mx-1">Arena</h6>
              <input class="small-text custom-input" v-model="team.arena">
            </div>

            <div class="container mt-3">
              <h6 class="mx-1">Address</h6>
              <input class="small-text custom-input" v-model="team.address">
            </div>

          </div>
          <div class="col-md-1">

          </div>
          <div class="col-md-8">
            <table class="table table-hover table-bordered small-text">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Last name</th>
                <th scope="col">First name</th>
                <th scope="col">Height</th>
                <th scope="col">Weight</th>
                <th scope="col">Position</th>
                <th scope="col">Birth</th>
                <th scope="col">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(player, index) in team.currentPlayers" :key="player.id">
                <th scope="row">{{ index + 1 }}</th>
                <td>
                  <input class="small-text custom-input text-center" v-model="player.lastName">
                </td>
                <td>
                  <input class="small-text custom-input text-center" v-model="player.firstName">
                </td>
                <td>
                  <input class="small-text custom-input text-center" v-model="player.height">
                </td>
                <td>
                  <input class="small-text custom-input text-center" v-model="player.weight">
                </td>
                <td>
                  <select class="small-text custom-input text-center" v-model="player.position">
                    <option v-for="position in positions" :key="position" :value="position">{{position}}</option>
                  </select>
                </td>
                <td>
                  <input type="date" class="small-text custom-input text-center" v-model="player.birth">
                </td>
                <td style="text-align: center; vertical-align: middle;">
                  <button @click="confirmRemovePlayer(player)" type="button" class="btn small-text">
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <button type="submit" class="btn btn-success w-100 mb-2">Save changes</button>
      </form>
    </template>
    <template v-else>
      <Loading></Loading>
    </template>
  </div>
</template>

<style scoped>

</style>
