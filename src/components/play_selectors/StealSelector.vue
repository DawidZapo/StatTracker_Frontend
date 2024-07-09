<script setup>
import {onMounted, ref, watch} from "vue";
import {formatTypeText} from "../../assets/scripts/utilts.js";

const props = defineProps({
  hands: {
    type: Array,
    required: true
  },
  player: {
    type: Object,
    required: true
  },
  timeStamp: {
    type: Number,
    required: true
  },
  gameId: {
    type: Number,
    required: true
  },
  possibleTurnoverForPlayers: {
    type: Array,
    required: true
  }
});

const steal = ref({
      comments: null,
      duration: props.timeStamp,
      gameId: props.gameId,
      hand: props.player.dominantHand,
      id: null,
      playType : "steal",
      statPlayerId : props.player.statPlayerId,
      turnoverForStatPlayerId : null
});

const handleCommentsInput = (text) => {
  if(text.trim() === ''){
    steal.value.comments = null;
  }
};

const emit = defineEmits(['update:steal']);

watch(
    () => props.player,
    (newPlayer) => {
      steal.value.statPlayerId = newPlayer.statPlayerId;
      steal.value.hand = newPlayer.dominantHand;
    },
    { immediate: true }
);

onMounted(()=>{
  emit('update:steal', steal.value);
});
watch(steal, (newValue) => {
  emit('update:steal', newValue);
}, {deep: true});

</script>

<template>
  <div class="container">
    <div class="row text-center d-flex align-items-center">
      <div class="col">
        <select class="form-select small small-text" :class="{'reduced-opacity' : steal.turnoverForStatPlayerId === null}" v-model="steal.turnoverForStatPlayerId">
          <option disabled selected :value="null">Turnover for</option>
          <option v-for="player in possibleTurnoverForPlayers" :value="player.statPlayerId">{{'#' + player.shirtNumber + ' ' + player.firstName + ' ' + player.lastName}}</option>
        </select>
      </div>
      <div class="col">
        <input @input="handleCommentsInput(steal.comments)" placeholder="Add comments" type="text" class="form-control small small-text" v-model="steal.comments">
      </div>
      <div class="col">
        <select class="form-select small small-text" v-model="steal.hand">
          <option v-for="hand in hands" :value="hand">{{hand}}</option>
        </select>
      </div>
    </div>
    {{steal}}
  </div>
</template>

<style scoped>

</style>
