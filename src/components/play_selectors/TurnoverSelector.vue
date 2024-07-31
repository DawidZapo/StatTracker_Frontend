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
  },
  data: {
    type: Object,
    required: false
  }
});


const turnover = ref({
      comments: props.data ? props.data.comments : null,
      timeRemaining: props.data ? props.data.timeRemaining : props.timeStamp,
      quarter: props.data ? props.data.quarter : props.quarter,
      gameId: props.data ? props.data.gameId : props.gameId,
      hand: props.data ? props.data.hand : props.player.dominantHand,
      id: props.data ? props.data.id : null,
      playType: props.data ? props.data.playType : "TURNOVER",
      statPlayerId: props.data ? props.data.statPlayerId : props.player.statPlayerId,
      stealForStatPlayerId: props.data ? props.data.stealForStatPlayerId : null,
      type: props.data ? props.data.type : null
});

watch(
    () => props.data,
    (newData) => {
      turnover.value = newData;
    }
)

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
      if(!props.data){
        turnover.value.hand = newPlayer.dominantHand;
      }
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
  <div class="container p-1">
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
  </div>
</template>

<style scoped>

</style>
