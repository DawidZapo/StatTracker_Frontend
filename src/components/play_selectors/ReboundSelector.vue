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
  }
});

const rebound = ref({
      comments: null,
      timeRemaining: props.timeStamp,
      quarter: props.quarter,
      gameId: props.gameId,
      hand: props.player.dominantHand,
      id: null,
      playType : "REBOUND",
      statPlayerId : props.player.statPlayerId,
      offensive : false
});


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
      rebound.value.hand = newPlayer.dominantHand;
    },
    { immediate: true }
);

</script>

<template>
  <div class="container">
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
    {{rebound}}
  </div>
</template>

<style scoped>

</style>
