<script setup>
import {computed, ref, watch} from "vue";
import {useStore} from "vuex";
import PlayerService from "@/services/player/player.service.js";
import Loading from "@/components/error/Loading.vue";

const player = ref(null);
const store = useStore();
const selectedPlayerId = computed(() => store.getters.selectedPlayerId);
const fetchPlayer = async (id) => {
  try{
    if(id){
      player.value = await PlayerService.fetchPlayerWithTeam(id);
    }
  }catch (error) {
    console.error("Error while fetching player: " , error);
  }
};

watch(selectedPlayerId, (newId) => {
  fetchPlayer(newId);
});
fetchPlayer(selectedPlayerId.value);


</script>

<template>
  <div class="container shadow-lg">
    <div class="d-flex justify-content-center">
      <h5 class="mt-2">Player info</h5>
    </div>
    <hr class="my-2">
    <template v-if="player !== null">
        <div class="card">
          <div class="card-body text-center small-text d-flex">
            <div class="col-md-6">
              <div class="row mb-3">
                <div class="col-6 text-end fw-bold">
                  Name:
                </div>
                <div class="col-6 text-start">
                  {{ player.firstName + ' ' + player.lastName  }}
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-6 text-end fw-bold">
                  Team:
                </div>
                <div class="col-6 text-start">
                  {{ player.teamName }}
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-6 text-end fw-bold">
                  Position:
                </div>
                <div class="col-6 text-start">
                  {{ player.position }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="row mb-3">
                <div class="col-6 text-end fw-bold">
                  Birthdate:
                </div>
                <div class="col-6 text-start">
                  {{ player.birth }}
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-6 text-end fw-bold">
                  Height:
                </div>
                <div class="col-6 text-start">
                  {{ player.height }} cm
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-6 text-end fw-bold">
                  Weight:
                </div>
                <div class="col-6 text-start">
                  {{ player.weight }} kg
                </div>
              </div>
            </div>
          </div>
        </div>
    </template>
    <template v-else>
      <Loading></Loading>
    </template>
    <div style="height: 10px"></div>
  </div>
</template>

<style scoped>

</style>
