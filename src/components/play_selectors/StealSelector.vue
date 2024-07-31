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
  possibleTurnoverForPlayers: {
    type: Array,
    required: true
  },
  data: {
    type: Object,
    required: false
  }
});

const steal = ref({
      comments: props.data ? props.data.comments : null,
      timeRemaining: props.data ? props.data.timeRemaining : props.timeStamp,
      quarter: props.data ? props.data.quarter : props.quarter,
      gameId: props.data ? props.data.gameId : props.gameId,
      hand: props.data ? props.data.hand : props.player.dominantHand,
      id: props.data ? props.data.id : null,
      playType: props.data ? props.data.playType : "STEAL",
      statPlayerId: props.data ? props.data.statPlayerId : props.player.statPlayerId,
      turnoverForStatPlayerId: props.data ? props.data.turnoverForStatPlayerId : null
});

watch(
    () => props.data,
    (newData) => {
      steal.value = newData;
    }
)

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
      if(!props.data) {
        steal.value.hand = newPlayer.dominantHand;
      }
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
  <div class="container p-1">
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
  </div>
</template>

<style scoped>

</style>
