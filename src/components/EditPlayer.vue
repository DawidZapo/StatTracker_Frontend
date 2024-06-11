<script setup>
import Loading from "@/components/error/Loading.vue";
import {computed, ref, watch} from "vue";
import {useStore} from "vuex";
import PlayerService from "@/services/player/player.service.js";
import TeamService from "@/services/team/team.service.js";

const player = ref(null);
const store = useStore();
const selectedPlayerId = computed(() => store.getters.selectedPlayerId);
const submitResponse = ref('');
const submitSuccess = ref(true);
const positions = ref(['POINT_GUARD', 'SHOOTING_GUARD', 'SMALL_FORWARD', 'POWER_FORWARD', 'CENTER']);
const teams = ref([]);

const fetchPlayer = async (id) => {
  try{
    if(id){
      player.value = await PlayerService.fetchPlayerWithTeam(id);
    }
  }catch (error) {
    console.error("Error while fetching player: " , error);
  }
};

const fetchTeams = async () => {
  try{
    teams.value = await TeamService.fetchAllTeam();
  }
  catch (error) {
    console.error("Error while fetching teams: " + error);
  }
}

watch(selectedPlayerId, (newId) => {
  fetchPlayer(newId);
  fetchTeams();
});
fetchPlayer(selectedPlayerId.value);
fetchTeams();


const handleSubmit = async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  try{
    console.log(player.value);
    submitResponse.value = await PlayerService.savePlayerWithTeam(player.value);
    submitSuccess.value = true;

  }catch (error) {
    console.error("Error while saving team: ", error);
    submitResponse.value = 'Error while saving team';
    submitSuccess.value = false;
  }
};
</script>

<template>
  <div class="container shadow-lg">
    <div v-if="submitResponse !== '' ">
      <div style="height: auto; line-height: 0.1;" :class="['alert', 'text-center' ,submitSuccess === true ? 'alert-success' : 'alert-danger']">
        {{submitResponse}}
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <h5 class="mt-2">Edit Player</h5>
    </div>
    <hr class="my-2">
    <template v-if="player !== null">
      <form @submit.prevent="handleSubmit" class="card">
        <input type="hidden" v-model="player.id">
        <div class="card-body text-center small-text d-flex">
          <div class="col-md-3">
            <div class="row mb-3 d-flex align-items-center">
              <div class="container w-50">
                <h6 class="mx-1">First Name</h6>
                <input class="small-text custom-input text-center" v-model="player.firstName">
              </div>
            </div>
            <div class="row mb-3 d-flex align-items-center">
              <div class="container w-50">
                <h6 class="mx-1">Last Name</h6>
                <input class="small-text custom-input text-center" v-model="player.lastName">
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="row mb-3 d-flex align-items-center">
              <div class="container w-50">
                <h6 class="mx-1">Birthdate</h6>
                <input class="small-text custom-input text-center" v-model="player.birth">
              </div>
            </div>
            <div class="row mb-3 d-flex align-items-center">
              <div class="container w-50">
                <h6 class="mx-1">Position</h6>
                <select class="small-text custom-input text-center" v-model="player.position">
                  <option v-for="position in positions" :key="position" :value="position">{{position}}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="row mb-3 d-flex align-items-center">
              <div class="container w-50">
                <h6 class="mx-1">Height</h6>
                <input class="small-text custom-input text-center" v-model="player.height">
              </div>
            </div>
            <div class="row mb-3 d-flex align-items-center">
              <div class="container w-50">
                <h6 class="mx-1">Weight</h6>
                <input class="small-text custom-input text-center" v-model="player.weight">
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="row mb-3 d-flex align-items-center">
              <div class="container w-50">
                <h6 class="mx-1">Team</h6>
                <select class="small-text custom-input text-center" v-model="player.teamId">
                  <option v-for="team in teams" :key="team" :value="team.id">{{team.name}}</option>
                </select>
<!--                <input v-model="player.teamName">-->
              </div>
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-success w-100">Save changes</button>
      </form>
    </template>
    <template v-else>
      <Loading></Loading>
    </template>
    <div style="height: 10px"></div>
  </div>
</template>

<style scoped>

</style>
