<script setup>

import {computed, ref, watch} from "vue";
import {useStore} from "vuex";
import PlayerService from "@/services/player/player.service.js";

const store = useStore();
const playerWithSeasons = ref([]);
const selectedPlayerId = computed(()=> store.getters.selectedPlayerId);

const fetchPlayerWithSeasons = async (id) => {
  try{
    if(id){
      playerWithSeasons.value = await PlayerService.fetchPlayerWithStatsTotalsWithSeason(id);
    }
  }
  catch (error) {
    console.error("Error while fetching player with stats totals with season: " + error);
  }
};

watch(selectedPlayerId, (newId) =>{
  fetchPlayerWithSeasons(newId);
});
fetchPlayerWithSeasons(selectedPlayerId.value);

</script>

<template>
  <div>
      {{playerWithSeasons}}
  </div>
</template>

<style scoped>

</style>
