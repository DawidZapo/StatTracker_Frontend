<script setup>
import {useStore} from "vuex";
import {computed, onMounted, ref, watch} from "vue";
import TeamService from "@/services/team/team.service.js";
import UserService from "@/services/user/user.service.js";
import TeamWithPlayers from "@/models/team/TeamWithPlayers.js";

const store = useStore();
const selectedTeamId = computed(() => store.getters.selectedTeamId);

const team = ref(null);
const fetchTeamData = async (id) => {
  try {
    if (id) {
      const response = await TeamService.fetchTeam(id);
      team.value = response;
    } else {
      team.value = null;
    }
  } catch (error) {
    console.error("Error while fetching team: ", error);
  }
};

watch(selectedTeamId, (newId) => {
  fetchTeamData(newId);
});

fetchTeamData(selectedTeamId.value);

</script>

<template>
  <div>
    <template v-if="team !== null">
      {{team.id}} || {{team.name}} || {{team.location}}
      Current Players:
      <ul>
        <li v-for="player in team.currentPlayers" :key="player.id">
          {{ player.firstName }}
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>

</style>
