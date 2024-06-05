<script setup>
import {computed, ref, watch} from "vue";
import {useStore} from "vuex";
import PlayerService from "@/services/player/player.service.js";

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
    {{player}}
  </div>
</template>

<style scoped>

</style>
