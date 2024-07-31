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
  data: {
    type: Object,
    required: false
  }
});

const rebound = ref({
      comments: props.data ? props.data.comments : null,
      timeRemaining: props.data ? props.data.timeRemaining : props.timeStamp,
      quarter: props.data ? props.data.quarter : props.quarter,
      gameId: props.data ? props.data.gameId : props.gameId,
      hand: props.data ? props.data.hand : props.player.dominantHand,
      id: props.data ? props.data.id : null,
      playType: props.data ? props.data.playType : "REBOUND",
      statPlayerId: props.data ? props.data.statPlayerId : props.player.statPlayerId,
      offensive: props.data ? props.data.offensive : false
});

watch(
    () => props.data,
    (newData) => {
      rebound.value = newData;
    }
)


const emit = defineEmits(['update:rebound']);

const handleCommentsInput = (text) => {
  if(text.trim() === ''){
    rebound.value.comments = null;
  }
};

onMounted(()=>{
  emit('update:rebound', rebound.value);
});
watch(rebound, ()=>{
  emit('update:rebound', rebound.value);
}, {deep: true});

watch(
    () => props.player,
    (newPlayer) => {
      rebound.value.statPlayerId = newPlayer.statPlayerId;
      if(!props.data){
        rebound.value.hand = newPlayer.dominantHand;
      }
    },
    { immediate: true }
);

</script>

<template>
  <div class="container p-1">
    <div class="row text-center d-flex align-items-center">
      <div class="col">
        <div class="col d-flex align-items-center justify-content-center">
          <input type="checkbox" class="form-check-input mx-1" v-model="rebound.offensive" id="made">
          <label class="form-check-label" for="made">Is offensive</label>
        </div>
      </div>
      <div class="col">
        <input @input="handleCommentsInput(rebound.comments)" placeholder="Add comments" type="text" class="form-control small small-text" v-model="rebound.comments">
      </div>
      <div class="col">
        <select class="form-select small small-text" v-model="rebound.hand">
          <option v-for="hand in hands" :value="hand">{{hand}}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
