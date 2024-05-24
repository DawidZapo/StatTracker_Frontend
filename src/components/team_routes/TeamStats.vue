<script setup>
import {useStore} from "vuex";
import {computed, ref, watch} from "vue";
import TeamService from "@/services/team/team.service.js";

const store = useStore();
const selectedTeamId = computed(() => store.getters.selectedTeamId);
const teamWithStatTotals = ref(null);
const fetchTeamData = async (id) => {
  try {
    if (id) {
      const response = await TeamService.fetchTeamWithStatTotals(id);
      teamWithStatTotals.value = response;
    } else {
      teamWithStatTotals.value = null;
    }
  } catch (error) {
    console.error("Error while fetching team with stat totals: ", error);
  }
};

watch(selectedTeamId, (newId) => {
  fetchTeamData(newId);
});
fetchTeamData(selectedTeamId.value);
</script>

<template>
  <div>
    <template v-if="teamWithStatTotals != null">
      team stats here || TeamWithPlayers ID: {{selectedTeamId}} ||
      {{teamWithStatTotals.id}} // fetching teamWithStatTotals work properly
    </template>
  </div>
</template>

<style scoped>

</style>
