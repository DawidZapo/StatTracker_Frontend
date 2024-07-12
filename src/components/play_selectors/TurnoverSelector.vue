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
  quarter: {
    type: Number,
    required: true
  },
  gameId: {
    type: Number,
    required: true
  },
  types: {
    type: Array,
    required: true
  },
  possibleStealOnPlayers: {
    type: Array,
    required: true
  }
});


const turnover = ref({
      comments : null,
      timeRemaining: props.timeStamp,
      quarter: props.quarter,
      gameId : props.gameId,
      hand : props.player.dominantHand,
      id : null,
      playType : "turnover",
      statPlayerId : props.player.statPlayerId,
      stealForStatPlayerId : null,
      type : null
});

const emit = defineEmits(['update:turnover']);

const handleCommentsInput = (text) => {
  if(text.trim() === ''){
    turnover.value.comments = null;
  }
};

watch(
    () => props.player,
    (newPlayer) => {
      turnover.value.statPlayerId = newPlayer.statPlayerId;
      turnover.value.hand = newPlayer.dominantHand;
    },
    { immediate: true }
);

onMounted(()=>{
  emit('update:turnover', turnover.value);
});
watch(turnover, (newValue) => {
  emit('update:turnover', newValue);
}, {deep: true});


</script>

<template>
  <div class="container">
    <div class="row text-center d-flex align-items-center">
      <div class="col">
        <select class="form-select small small-text" v-model="turnover.type" :class="{'reduced-opacity' : turnover.type === null}">
          <option disabled selected :value="null">Type</option>
          <option v-for="type in types" :value="type">{{type}}</option>
        </select>
      </div>
      <div class="col">
        <select class="form-select small small-text" :class="{'reduced-opacity' : turnover.stealForStatPlayerId === null}" v-model="turnover.stealForStatPlayerId">
          <option disabled selected :value="null">Steal for</option>
          <option v-for="player in possibleStealOnPlayers" :value="player.statPlayerId">{{'#' + player.shirtNumber + ' ' + player.firstName + ' ' + player.lastName}}</option>
        </select>
      </div>
      <div class="col">
        <select class="form-select small small-text" v-model="turnover.hand">
          <option v-for="hand in hands" :value="hand">{{hand}}</option>
        </select>
      </div>
    </div>
    <div class="row mt-1">
      <div class="col">
        <input @input="handleCommentsInput(turnover.comments)" placeholder="Add comments" type="text" class="form-control small small-text" v-model="turnover.comments">
      </div>
    </div>
    {{turnover}}
  </div>
</template>

<style scoped>

</style>
