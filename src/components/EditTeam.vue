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

    </template>
    <template v-else>
      <Loading></Loading>
    </template>
  </div>
</template>

<style scoped>

</style>
