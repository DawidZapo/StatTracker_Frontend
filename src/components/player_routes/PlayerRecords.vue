<script setup>
import {computed, ref, watch} from "vue";
import {useStore} from "vuex";
import PlayerService from "@/services/player/player.service.js";

const records = ref([]);
const store = useStore();
const selectedPlayerId = computed(() => store.getters.selectedPlayerId);
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

watch(selectedPlayerId, (newId) => {
  fetchPlayerRecords(newId);
});
fetchPlayerRecords(selectedPlayerId.value);
</script>

<template>
  <div>
    {{records}}
  </div>
</template>

<style scoped>

</style>
