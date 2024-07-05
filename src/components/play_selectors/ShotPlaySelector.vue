<script setup>

import {computed, ref, watch} from "vue";
import {formatTypeText} from "../../assets/scripts/utilts.js";

const props = defineProps({
  types: {
    type: Array,
    required: true
  },
  hands: {
    type: Array,
    required: true
  },
  contested: {
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
  zones: {
    type: Array,
    required: true
  },
  gameId: {
    type: Number,
    required: true
  },
  selectedZone: {
    type: String,
    required: false
  }
});

const handleCommentsInput = (text) => {
  if(text.trim() === ''){
    shotPlay.value.comments = null;
  }
};

const twoPointZones = computed(()=> props.zones.filter(zone => zone.includes("2PT")));
const threePointZones = computed(()=> props.zones.filter(zone => zone.includes("3PT")));
const selectedZone = ref([]);

const shotPlay = ref({
  id: null,
  comments: null,
  contested: null,
  duration: props.timeStamp,
  gameId: props.gameId,
  hand: props.player.dominantHand,
  made: false,
  offTheDribble: false,
  playType: 'shot',
  statPlayerId: props.player.statPlayerId,
  type: null,
  worth: null,
  zone: null

});

watch(
    () => props.player,
    (newPlayer) => {
      shotPlay.value.statPlayerId = newPlayer.statPlayerId;
      shotPlay.value.hand = newPlayer.dominantHand;
    },
    { immediate: true }
);

watch(()=>shotPlay.value.worth, (newValue, oldValue)=>{
  if(shotPlay.value.worth === 1){
    shotPlay.value.contested = 'NONE';
    shotPlay.value.type = 'FREE_THROW';
    shotPlay.value.offTheDribble = false;
    shotPlay.value.zone = 'FREE_THROW';
  }
  else if (shotPlay.value.worth === 2){
    shotPlay.value.contested = null;
    shotPlay.value.type = null;
    shotPlay.value.offTheDribble = null;
    shotPlay.value.zone = null;
    shotPlay.value.type = 'LAYUP_UNDERHAND';
    selectedZone.value = twoPointZones.value;

  }
  else{
    shotPlay.value.contested = null;
    shotPlay.value.type = null;
    shotPlay.value.offTheDribble = null;
    shotPlay.value.zone = null;
    shotPlay.value.type = 'JUMP_SHOT';
    selectedZone.value = threePointZones.value;
  }
});

</script>

<template>
  <div class="container">
    <div class="row text-center d-flex align-items-center">
      <div class="col">
        <div class="row">
          <div class="col">
            <input class="form-check-input mx-1" type="radio" v-model="shotPlay.worth" id="3PT" :value="3">
            <label class="form-check-label" for="3PT">3PT</label>
          </div>
          <div class="col">
            <input class="form-check-input mx-1" type="radio" v-model="shotPlay.worth" id="2PT" :value="2">
            <label class="form-check-label" for="2PT">2PT</label>
          </div>
          <div class="col">
            <input class="form-check-input mx-1" type="radio" v-model="shotPlay.worth" id="FT" :value="1">
            <label class="form-check-label" for="FT">FT</label>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="row">
          <div class="col-6">
            <select class="form-select small-text" v-model="shotPlay.hand" id="hand">
              <option disabled selected>Select hand</option>
              <option v-for="hand in hands">{{hand}}</option>
            </select>
<!--            <label class="form-check-label" for="hand">Hand</label>-->
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            <input type="checkbox" class="form-check-input mx-1" v-model="shotPlay.made" id="made">
            <label class="form-check-label" for="made">Made</label>
          </div>
        </div>
      </div>
    </div>
    <hr class="my-2">
    <div v-if="shotPlay.worth === 1" class="row mt-1">
      <div class="p-1">
        <input @input="handleCommentsInput(shotPlay.comments)" placeholder="Add comments" type="text" class="form-control small small-text" v-model="shotPlay.comments">
      </div>
    </div>
    <div v-else class="row">
      <div class="p-1">
        <div class="row">
          <div class="col">
            <select class="form-select small small-text" v-model="shotPlay.type">
              <option selected disabled :value="null">Type</option>
              <option v-for="type in types" :value="type">{{formatTypeText(type)}}</option>
            </select>
          </div>
          <div class="col">
            <select class="form-select small small-text" v-model="shotPlay.contested">
              <option selected disabled :value="null">Contested</option>
              <option v-for="type in contested" :value="type">{{formatTypeText(type)}}</option>
            </select>
          </div>
          <div class="col d-flex justify-content-center align-items-center">
            <input type="checkbox" class="form-check-input mx-1" v-model="shotPlay.offTheDribble" id="made">
            <label class="form-check-label" for="made">Off the dribble</label>
          </div>
          <div class="col">
            <select class="form-select small small-text" v-model="shotPlay.zone">
              <option selected disabled :value="null">Zone</option>
              <option v-for="type in selectedZone" :value="type">{{formatTypeText(type)}}</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <input @input="handleCommentsInput(shotPlay.comments)" placeholder="Add comments" type="text" class="form-control small small-text" v-model="shotPlay.comments">
          </div>
        </div>
      </div>
    </div>
    {{shotPlay}}
  </div>
</template>

<style scoped>

</style>
