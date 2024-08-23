<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from 'vue';
import {useStore} from "vuex";
import GameService from "@/services/game/game.service.js";
import EnumService from "@/services/enum/enum.service.js";
import Loading from "@/components/error/Loading.vue";
import ShotPlaySelector from "@/components/play_selectors/ShotPlaySelector.vue";
import AssistSelector from "@/components/play_selectors/AssistSelector.vue";
import ReboundSelector from "@/components/play_selectors/ReboundSelector.vue";
import FoulSelector from "@/components/play_selectors/FoulSelector.vue";
import BlockSelector from "@/components/play_selectors/BlockSelector.vue";
import TurnoverSelector from "@/components/play_selectors/TurnoverSelector.vue";
import StealSelector from "@/components/play_selectors/StealSelector.vue";
import {getBenchPlayers, getOnCourtPlayers} from "@/assets/scripts/stats.js";
import GameToHandle, {
  Assist,
  Foul,
  Rebound,
  ShotPlay,
  Steal,
  Turnover,
  Block,
  Violation
} from "@/models/game/GameToHandle.js";
import PlayService from "@/services/play/play.serivce.js";
import gameService from "@/services/game/game.service.js";
import {
  addPlayToPlayerAndGame,
  describeArc, findLineUpByStatPlayerId, findTeamAndPlayerByPlayStatPlayerId,
  smoothScrollToBottom,
  updateTeamAndPlayerStats
} from "@/assets/scripts/utilts.js";
import Notification from "@/components/helper/Notification.vue";
import ViolationSelector from "@/components/play_selectors/ViolationSelector.vue";

const store = useStore();
const selectedGameId = ref(localStorage.getItem('selectedGameId'));
// const selectedGameId = ref(6);
const highlightedZone = ref(null);
const selectedZone = ref(null);
const game = ref(null);
const selectedPlay = ref(null);
const selectedPlayer = ref(null);
const homeLineUp = ref([]);
const awayLineUp = ref([]);
const homeBench = ref([]);
const awayBench = ref([]);
const homeLineUpSelectedPlayer = ref(null);
const homeBenchSelectedPlayer = ref(null);
const awayLineUpSelectedPlayer = ref(null);
const awayBenchSelectedPlayer = ref(null);
const assistTypes = ref([]);
const contestedTypes = ref([]);
const foulTypes = ref([]);
const handTypes = ref([]);
const shotTypes = ref([]);
const turnoverTypes = ref([]);
const zoneTypes = ref([]);
const violationTypes = ref([]);
const isFreeThrowSelected = ref(false);
// const isPlaySubmissionCorrect = ref(false);
const showNotification = ref(false);
const notificationMessage = ref('');
const isNotificationSuccessful = ref(false);
const goodEditMessage = 'Play has been successfully edited';
const badMessage = 'Ops, there was an error while saving play';
const goodAddMessage = 'Play has been successfully added';
const playToEdit = ref(null);
const currentQuarter = computed(()=>{
  return game.value.currentQuarter;
});
const currentTimeStampInMs = computed(()=>{
  if(game.value.currentQuarter === 1){
    return game.value.currentQuarterTimeRemainingMs;
  }
  return ((game.value.currentQuarter - 1) * (game.value.quarterLengthMin * 60000)) + game.value.currentQuarterTimeRemainingMs;
});

const getCurrentTeamPlayers = computed(()=>{
  if(homeLineUp.value.includes(selectedPlayer.value)){
    return homeLineUp.value;
  }
  else if(awayLineUp.value.includes(selectedPlayer.value)) {
    return awayLineUp.value;
  }
  else{
    return null;
  }

});

const allPlayers = computed(() => {
  return [...game.value.home.players, ...game.value.away.players];
});

const getOpposingTeamPlayers = computed(()=>{
  if(homeLineUp.value.includes(selectedPlayer.value)){
    return awayLineUp.value;
  }
  else if(awayLineUp.value.includes(selectedPlayer.value)) {
    return homeLineUp.value;
  }
  else{
    throw new Error('No opposing team found');
  }
});

function resetPlayPlayerAndZone(){
  selectedPlay.value = null;
  selectedPlayer.value = null;
  selectedZone.value = null;
  // isPlaySubmissionCorrect.value = false;
}


const createdPlay = ref(null);

const fetchGameToHandle = async (id) => {
  try{
    if(id){
      game.value = await GameService.fetchGameToHandle(id);

      homeLineUp.value = getOnCourtPlayers(game.value.home.players);
      homeBench.value = getBenchPlayers(game.value.home.players);

      awayLineUp.value = getOnCourtPlayers(game.value.away.players);
      awayBench.value = getBenchPlayers(game.value.away.players);

    }
  }catch (error) {
    console.error("Error while fetching game to handle: " + error);
    game.value = null;
  }
};

const fetchNewUpdateGameToHandle = async (id) => {
  try{
    if(id){
      game.value = await GameService.fetchGameToHandle(id);
    }
  }catch (error) {
    console.error("Error while fetching new update game to handle: " + error);
    game.value = null;
  }
};

const saveGame = async (gameToHandle) =>{
  console.log('saving game');
  console.log(gameToHandle);
  const gameTosave = new GameToHandle(gameToHandle);
  console.log(gameTosave);
  try{
    if(gameToHandle){
      game.value = await GameService.saveGameToHandle(gameToHandle);
    }
  }
  catch (error) {
    console.error('Error while saving game: ' + error);
  }
};

const fetchTypes = async () => {
  try{
    assistTypes.value = await EnumService.fetchEnumTypes('assist');
    contestedTypes.value = await EnumService.fetchEnumTypes('contested');
    foulTypes.value = await EnumService.fetchEnumTypes('foul');
    handTypes.value = await EnumService.fetchEnumTypes('hand');
    shotTypes.value = await EnumService.fetchEnumTypes('shot');
    turnoverTypes.value = await EnumService.fetchEnumTypes('turnover');
    zoneTypes.value = await EnumService.fetchEnumTypes('zone');
    violationTypes.value = await EnumService.fetchEnumTypes('violation');
  }
  catch (error) {
    console.error('Error while fetching types of:' + error);
  }
};

fetchGameToHandle(selectedGameId.value);
fetchTypes();

const highlightZone = (zone) => {
  highlightedZone.value = zone;
};

const handleZoneClick = (zone) => {
  selectedZone.value = zone;
};
const handleMouseLeave = () => {
  highlightedZone.value = null;
};

const activeTab = ref('panel');

const clickPlayerSelected = (player) => {
  if(selectedPlayer.value === player){
    selectedPlayer.value = null;
    selectedPlay.value = null;
    isFreeThrowSelected.value = false;
    return;
  }
  selectedPlayer.value = player;
};

const clickSwapPlayerIcon = (player, team) => {
  if(team === 'home'){
    if(homeLineUpSelectedPlayer.value === player){
      homeLineUpSelectedPlayer.value = null;
      return
    }
    homeLineUpSelectedPlayer.value = player;
  }
  else if (team === 'away'){
    if(awayLineUpSelectedPlayer.value === player){
      awayLineUpSelectedPlayer.value = null;
      return;
    }
    awayLineUpSelectedPlayer.value = player;
  }
  else{
    console.error('Wrong team in clickSwapPlayerIcon function');
  }
};

const swapPlayer = (playerOn, playerOff, positionSwapped, bench, lineup) => {
  const playerOffIndex = lineup.findIndex(player => player.playerId === playerOff.playerId);
  const playerOnIndex = bench.findIndex(player => player.playerId === playerOn.playerId);
  selectedPlayer.value = null;
  selectedPlay.value = null;

  if (playerOffIndex !== -1 && playerOnIndex !== -1) {
    const [playerOn] = bench.splice(playerOnIndex, 1);
    playerOn.positionOnCourt = positionSwapped;
    playerOn.onCourt = true;
    lineup.push(playerOn);

    const [playerOff] = lineup.splice(playerOffIndex, 1);
    playerOff.positionOnCourt = 0;
    playerOff.onCourt = false;
    bench.push(playerOff);

  } else {
    console.log(`Couldn't find players in lists`);
  }
};

watch([homeBenchSelectedPlayer, homeLineUpSelectedPlayer],([newField1, newField2], [oldField1, oldField2])=>{
  if(homeBenchSelectedPlayer.value !== null && homeLineUpSelectedPlayer.value !== null){
    swapPlayer(newField1, newField2, newField2.positionOnCourt, homeBench.value, homeLineUp.value);
    homeBenchSelectedPlayer.value = null;
    homeLineUpSelectedPlayer.value = null;

    homeLineUp.value.sort((a,b) => a.positionOnCourt - b.positionOnCourt);
  }

});

watch([awayBenchSelectedPlayer, awayLineUpSelectedPlayer],([newField1, newField2], [oldField1, oldField2])=>{
  if(awayBenchSelectedPlayer.value !== null && awayLineUpSelectedPlayer.value !== null){
    swapPlayer(newField1, newField2, newField2.positionOnCourt, awayBench.value, awayLineUp.value);
    awayBenchSelectedPlayer.value = null;
    awayLineUpSelectedPlayer.value = null;

    awayLineUp.value.sort((a,b) => a.positionOnCourt - b.positionOnCourt);
  }
});

const handlePlayEmit = (playData) => {
  createdPlay.value = playData;
  // console.log(createdPlay.value);
};

// validation
// const handlePlaySubmissionEmit = (trueOrFalse) => {
//   isPlaySubmissionCorrect.value = trueOrFalse;
// }

const handlePlaySelect = (play) => {
  selectedZone.value = null;

  if(selectedPlay.value === play){
    selectedPlay.value = null;
    return;
  }
  selectedPlay.value = play;
  // isPlaySubmissionCorrect.value = false;
};

const handleEditPlaySelect = (play) => {
  if(playToEdit.value === play){
    playToEdit.value = null;
    selectedZone.value = null;
    createdPlay.value = null;
  }
  else{
    playToEdit.value = play;
    selectedZone.value = play.zone;
  }
};

const handleSaveGame = ()=>{
  saveGame(game.value);
};

const handlePlayClick = (type) => {
  switch (type) {
    case 'SHOTPLAY': clickShotPlayAdd();
      break;
    case 'ASSIST': clickAssistAdd();
      break;
    case 'REBOUND': clickReboundAdd();
      break;
    case 'STEAL': clickStealAdd();
      break;
    case 'TURNOVER': clickTurnoverAdd();
      break;
    case 'FOUL': clickFoulAdd();
      break;
    case 'BLOCK': clickBlockAdd();
      break;
    case 'VIOLATION': clickViolationAdd();
      break;

  }
};

const handleGoodNotificationStuff = (doesPlayExist) => {
  isNotificationSuccessful.value = true;
  showNotification.value = true;
  if(doesPlayExist){
    playToEdit.value = null;
    notificationMessage.value = goodEditMessage;
  }
  else{
    notificationMessage.value = goodAddMessage;
  }
};
const handleBadNotificationStuff = () => {
  playToEdit.value = null;
  isNotificationSuccessful.value = false;
  showNotification.value = true;
  notificationMessage.value = badMessage;
};
const turnOffNotification = () => {
  setTimeout(() => {
    showNotification.value = false;
  }, 4000);
};
const clickShotPlayAdd = async () => {
  const shotPlayCreated = new ShotPlay(createdPlay.value);

  try{
    const response = await PlayService.savePlay('shot_play', shotPlayCreated);
    const newShotPlay = new ShotPlay(response);
    console.log(newShotPlay);

    const doesPlayExist = shotPlayCreated.id === newShotPlay.id;
    handleGoodNotificationStuff(doesPlayExist);

    addPlayToPlayerAndGame(game.value, newShotPlay, doesPlayExist);
    resetPlayPlayerAndZone();

    const team = findTeamAndPlayerByPlayStatPlayerId(game.value, newShotPlay).team;
    const player = findTeamAndPlayerByPlayStatPlayerId(game.value, newShotPlay).player;
    const lineups = findLineUpByStatPlayerId(player, homeLineUp.value, awayLineUp.value);
    const scoringLineup = lineups.scoringLineup;
    const loosingLineup = lineups.loosingLineup;
    updateTeamAndPlayerStats(team.stats, player.stats, newShotPlay, scoringLineup, loosingLineup);

  }
  catch (error) {
    selectedZone.value = null //only for shotplay
    handleBadNotificationStuff();
    console.error("Error while saving play: " + error);
  }

  turnOffNotification();

};

const clickAssistAdd = async () => {
  const assistCreated = new Assist(createdPlay.value);

  try{
    const response = await PlayService.savePlay('assist', assistCreated);
    const newAssist = new Assist(response);
    console.log(newAssist);

    const doesPlayExist = assistCreated.id === newAssist.id;
    handleGoodNotificationStuff(doesPlayExist);

    addPlayToPlayerAndGame(game.value, newAssist, doesPlayExist);
    resetPlayPlayerAndZone();

    const team = findTeamAndPlayerByPlayStatPlayerId(game.value, newAssist).team;
    const player = findTeamAndPlayerByPlayStatPlayerId(game.value, newAssist).player;
    updateTeamAndPlayerStats(team.stats, player.stats, newAssist);

  }
  catch (error) {
    handleBadNotificationStuff();
    console.error("Error while saving play: " + error);
  }

  turnOffNotification();
};

const clickReboundAdd = async () => {
  const reboundCreated = new Rebound(createdPlay.value);
  console.log(reboundCreated);

  try{
    const response = await PlayService.savePlay('rebound', reboundCreated);
    const newRebound = new Rebound(response);
    console.log(newRebound);

    const doesPlayExist = reboundCreated.id === newRebound.id;
    handleGoodNotificationStuff(doesPlayExist);

    addPlayToPlayerAndGame(game.value, newRebound, doesPlayExist);
    resetPlayPlayerAndZone();

    const team = findTeamAndPlayerByPlayStatPlayerId(game.value, newRebound).team;
    const player = findTeamAndPlayerByPlayStatPlayerId(game.value, newRebound).player;
    updateTeamAndPlayerStats(team.stats, player.stats, newRebound);

  }
  catch (error) {
    handleBadNotificationStuff();
    console.error("Error while saving play: " + error);
  }

  turnOffNotification();
};

const clickFoulAdd = async () => {
  const foulCreated = new Foul(createdPlay.value);
  console.log(foulCreated);

  try{
    const response = await PlayService.savePlay('foul', foulCreated);
    const newFoul = new Foul(response);
    console.log(newFoul);

    const doesPlayExist = foulCreated.id === newFoul.id;
    handleGoodNotificationStuff(doesPlayExist);

    addPlayToPlayerAndGame(game.value, newFoul, doesPlayExist);
    resetPlayPlayerAndZone();

    const team = findTeamAndPlayerByPlayStatPlayerId(game.value, newFoul).team;
    const player = findTeamAndPlayerByPlayStatPlayerId(game.value, newFoul).player;
    updateTeamAndPlayerStats(team.stats, player.stats, newFoul);

  }
  catch (error) {
    handleBadNotificationStuff();
    console.error("Error while saving play: " + error);
  }

  turnOffNotification();
};

const clickStealAdd = async () => {
  const stealCreated = new Steal(createdPlay.value);
  console.log(stealCreated);

  try{
    const response = await PlayService.savePlay('steal', stealCreated);
    const newSteal = new Steal(response);
    console.log(newSteal);

    const doesPlayExist = stealCreated.id === newSteal.id;
    handleGoodNotificationStuff(doesPlayExist);

    addPlayToPlayerAndGame(game.value, newSteal, doesPlayExist);
    resetPlayPlayerAndZone();

    const team = findTeamAndPlayerByPlayStatPlayerId(game.value, newSteal).team;
    const player = findTeamAndPlayerByPlayStatPlayerId(game.value, newSteal).player;
    updateTeamAndPlayerStats(team.stats, player.stats, newSteal);

  }
  catch (error) {
    handleBadNotificationStuff();
    console.error("Error while saving play: " + error);
  }

  turnOffNotification();
};

const clickTurnoverAdd = async () => {
  const turnoverCreated = new Turnover(createdPlay.value);
  console.log(turnoverCreated);

  try{
    const response = await PlayService.savePlay('turnover', turnoverCreated);
    const newTurnover = new Turnover(response);
    console.log(newTurnover);

    const doesPlayExist = turnoverCreated.id === newTurnover.id;
    handleGoodNotificationStuff(doesPlayExist);

    addPlayToPlayerAndGame(game.value, newTurnover, doesPlayExist);
    resetPlayPlayerAndZone();

    const team = findTeamAndPlayerByPlayStatPlayerId(game.value, newTurnover).team;
    const player = findTeamAndPlayerByPlayStatPlayerId(game.value, newTurnover).player;
    updateTeamAndPlayerStats(team.stats, player.stats, newTurnover);

  }
  catch (error) {
    handleBadNotificationStuff();
    console.error("Error while saving play: " + error);
  }

  turnOffNotification();
};

const clickBlockAdd = async () => {
  const blockCreated = new Block(createdPlay.value);
  console.log(blockCreated);

  try{
    const response = await PlayService.savePlay('block', blockCreated);
    const newBlock = new Block(response);
    console.log(newBlock);

    const doesPlayExist = blockCreated.id === newBlock.id;
    handleGoodNotificationStuff(doesPlayExist);

    addPlayToPlayerAndGame(game.value, newBlock, doesPlayExist);
    resetPlayPlayerAndZone();

    const team = findTeamAndPlayerByPlayStatPlayerId(game.value, newBlock).team;
    const player = findTeamAndPlayerByPlayStatPlayerId(game.value, newBlock).player;
    updateTeamAndPlayerStats(team.stats, player.stats, newBlock);

  }
  catch (error) {
    handleBadNotificationStuff();
    console.error("Error while saving play: " + error);
  }

  turnOffNotification();
};

const clickViolationAdd = async () => {
  const violationCreated = new Violation(createdPlay.value);
  console.log(violationCreated);

  try{
    const response = await PlayService.savePlay('violation', violationCreated);
    const newViolation = new Violation(response);
    console.log(newViolation);

    const doesPlayExist = violationCreated.id === newViolation.id;
    handleGoodNotificationStuff(doesPlayExist);

    addPlayToPlayerAndGame(game.value, newViolation, doesPlayExist);
    resetPlayPlayerAndZone();

  }
  catch (error) {
    handleBadNotificationStuff();
    console.error("Error while saving play: " + error);
  }

  turnOffNotification();
};



let intervalId = null;
let stopTime = 0;

const isCounting = ref(false);

const formattedTime = computed(() => {

  let remainingTime = game.value.currentQuarterTimeRemainingMs;

  let minutes = Math.floor(remainingTime / 60000);
  let seconds = Math.floor((remainingTime % 60000) / 1000);
  let milliseconds = Math.floor((remainingTime % 1000) / 10);

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
});


const startCountdown = () => {
  if (!isCounting.value) {
    if (game.value.currentQuarterTimeRemainingMs === 0) {

      game.value.currentQuarterTimeRemainingMs = game.value.quarterLengthMin * 60000;
    } else if (stopTime !== 0) {

      game.value.currentQuarterTimeRemainingMs = stopTime;
      stopTime = 0;
    }

    intervalId = setInterval(() => {
      if (game.value.currentQuarterTimeRemainingMs > 0) {
        game.value.currentQuarterTimeRemainingMs -= 10;
      } else {
        clearInterval(intervalId);
        isCounting.value = false;
        if(game.value.currentQuarter < 4){
          game.value.currentQuarter++;
        }
      }
    }, 10);
    isCounting.value = true;
  }
};

const stopCountdown = () => {
  if (isCounting.value) {
    clearInterval(intervalId);
    intervalId = null;
    stopTime = game.value.currentQuarterTimeRemainingMs;
    isCounting.value = false;
  }
};

const toggleCountdown = () => {
  saveGame(game.value);
  if (isCounting.value) {
    stopCountdown();
  } else {
    startCountdown();
  }
};


watch(() => game.value?.plays, () => {
  const scrollableDiv = document.getElementById('divToScroll');
  if (scrollableDiv) {
    smoothScrollToBottom(scrollableDiv);
  }
}, { deep: true });

const findPlayerToSelectWhenEditingPlay = (id) => {
  let player = game.value.home.players.find(player => player.statPlayerId === id);
  if (!player) {
    player = game.value.away.players.find(player => player.statPlayerId === id);
  }
  if (player) {
    return player;
  } else {
    console.error(`Player with ID ${id} not found.`);
    return null;
  }
};

</script>

<template>
  <div v-if="game !== null">
    <div class="text-center navbar navbar-expand navbar-dark bg-dark">
      <div class="col-4">
        <div class="d-flex">
          <div class="col-10">
            <div class="card card-white-background">
              <div style="font-size: 35px;" class="no-overflow">{{ game.home.name }}</div>
            </div>
          </div>
          <div class="col-2">
            <div class="card card-white-background">
              <div class="digital-text">{{ game.home.stats.totalPoints }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="d-flex">
          <div class="col-3"></div>
          <div class="col-5">
            <div class="card card-white-background">
              <div class="digital-text">{{formattedTime}}</div>
            </div>
          </div>
          <div class="col-1">
            <div class="card card-white-background">
              <div class="digital-text">{{game.currentQuarter}}</div>
            </div>
          </div>
          <div class="col-3"></div>
        </div>
      </div>
      <div class="col-4">
        <div class="d-flex justify-content-end">
          <div class="col-2">
            <div class="card card-white-background">
              <div class="digital-text">{{ game.away.stats.totalPoints }}</div>
            </div>
          </div>
          <div class="col-10">
            <div class="card card-white-background">
              <div style="font-size: 35px;" class="no-overflow">{{game.away.name}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>

      <nav class="navbar navbar-expand navbar-light bg-light">
        <div class="w-100">
          <ul class="navbar-nav d-flex justify-content-center">
            <li class="nav-item mx-3"  @click="activeTab = 'panel'" style="cursor: pointer">
              <a class="nav-link">Panel</a>
            </li>
            <li class="nav-item mx-3" @click="activeTab = 'boxscore'" style="cursor: pointer">
              <a class="nav-link">Boxscore</a>
            </li>
            <li class="nav-item mx-3" @click="activeTab = 'options'" style="cursor: pointer">
              <a class="nav-link">Options</a>
            </li>
          </ul>
        </div>
      </nav>

      <div v-show="activeTab === 'panel'">
        <div class="container shadow-lg small-text">
          <div v-if="homeLineUpSelectedPlayer !== null" class="card p-2 text-center" style="position: absolute;top: 22.6%;left: 23.5%;width: 16%;z-index: 1000;background-color: #fafafa">
            <div class="d-flex" v-for="player in homeBench">
              <div class="card col-2 no-overflow">
                #{{player.shirtNumber}}
              </div>
              <div class="card col-9 no-overflow custom-btn-light">
                {{player.firstName.substring(0,1)}}. {{player.lastName}}
              </div>
              <div class="card col-1 no-overflow d-flex justify-content-center custom-btn-light" :class="{'custom-btn-light-selected' : homeBenchSelectedPlayer === player}">
                <i class="fa-solid fa-rotate" @click="homeBenchSelectedPlayer=player"></i>
              </div>
            </div>
            <div class="d-flex justify-content-center mt-2">
              <button @click="homeLineUpSelectedPlayer = null ; homeBenchSelectedPlayer = null" class="btn btn-outline-danger d-flex align-items-center justify-content-center" style="height: 10px">
                <i class="fa-solid fa-xmark" style="font-size: 10px"></i>
              </button>
            </div>
          </div>
          <div class="row mb-1">
            <div class="col-7 d-flex">

              <div class="col-4 text-center">
                <div class="d-flex my-3" v-for="player in homeLineUp">
                  <div class="card col-2 no-overflow">
                    #{{player.shirtNumber}}
                  </div>
                  <div class="card col-9 no-overflow custom-btn-light" :class="{'custom-btn-light-selected' : selectedPlayer === player}" @click="clickPlayerSelected(player)">
                    {{player.firstName.substring(0,1)}}. {{player.lastName}}
                  </div>
                  <div class="card col-1 no-overflow d-flex justify-content-center custom-btn-light" :class="{'custom-btn-light-selected' : homeLineUpSelectedPlayer === player}">
                    <i class="fa-solid fa-rotate" @click="clickSwapPlayerIcon(player, 'home')"></i>
                  </div>
                </div>
              </div>
              <div class="col-4 d-flex justify-content-center" :class="{'disabled' : !(selectedPlay === 'SHOTPLAY' || playToEdit?.playType === 'SHOTPLAY') || isFreeThrowSelected === true}">
                <svg
                    viewBox="0 0 47 50"
                    xmlns="http://www.w3.org/2000/svg"
                    width="200"
                    height="200"
                    style="cursor: pointer"
                    transform="rotate(90)">

                  <!-- background -->
                  <rect width="100%" height="100%" fill="tan"/>


                  <!--    zones-->
                  <path @click="handleZoneClick('BACK_COURT_3PT')" @mouseover="highlightZone('BACK_COURT_3PT')" d="M38 0 L 47 0 L 47 25.5 L41 25.5 Q 41 18 39 13 Q36 5 31 0" :fill="highlightedZone === 'BACK_COURT_3PT' || selectedZone === 'BACK_COURT_3PT' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave"></path>
                  <path @click="handleZoneClick('BACK_COURT_3PT')" @mouseover="highlightZone('BACK_COURT_3PT')" transform="scale(1, -1) translate(0, -50)" d="M38 0 L 47 0 L 47 25 L41 25 Q 41 18 39 13 Q36 5 31 0" :fill="highlightedZone === 'BACK_COURT_3PT' || selectedZone === 'BACK_COURT_3PT' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave"></path>

                  <path @click="handleZoneClick('RIGHT_CORNER_3PT')" @mouseover="highlightZone('RIGHT_CORNER_3PT')" d="M0 0 H13 V3 H0 L 0 0" :fill="highlightedZone === 'RIGHT_CORNER_3PT' || selectedZone === 'RIGHT_CORNER_3PT' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave"></path>
                  <path @click="handleZoneClick('RIGHT_WING_3PT')" @mouseover="highlightZone('RIGHT_WING_3PT')" d="M13 0 L31 0 Q 36 5 39 13 L24.5 13 Q 20.5 6.2 13 3" :fill="highlightedZone === 'RIGHT_WING_3PT' || selectedZone === 'RIGHT_WING_3PT' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave"></path>
                  <path @click="handleZoneClick('TOP_3PT')" @mouseover="highlightZone('TOP_3PT')" d="M24.5 13 L 39 13 Q 43 25  39 37 L 24.5 37 Q 30.9 25 24.5 13" :fill="highlightedZone === 'TOP_3PT' || selectedZone === 'TOP_3PT' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave"></path>
                  <path @click="handleZoneClick('LEFT_WING_3PT')" @mouseover="highlightZone('LEFT_WING_3PT')" transform="scale(1, -1) translate(0, -50)" d="M13 0 L31 0 Q 36 5 39 13 L24.5 13 Q 20.5 6.2 13 3" :fill="highlightedZone === 'LEFT_WING_3PT' || selectedZone === 'LEFT_WING_3PT' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave"></path>
                  <path @click="handleZoneClick('LEFT_CORNER_3PT')" @mouseover="highlightZone('LEFT_CORNER_3PT')" transform="scale(1, -1) translate(0, -50)" d="M0 0 H13 V3 H0 L 0 0" :fill="highlightedZone === 'LEFT_CORNER_3PT' || selectedZone === 'LEFT_CORNER_3PT' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave"></path>

                  <path @click="handleZoneClick('RIGHT_CORNER_2PT')" @mouseover="highlightZone('RIGHT_CORNER_2PT')" :fill="highlightedZone === 'RIGHT_CORNER_2PT' || selectedZone === 'RIGHT_CORNER_2PT' ?  'green' : 'transparent'" @mouseleave="handleMouseLeave" d="M0 3 L 13 3 L 8.6 15 L0 15" fill="none"></path>
                  <path @click="handleZoneClick('RIGHT_WING_2PT')" @mouseover="highlightZone('RIGHT_WING_2PT')" :fill="highlightedZone === 'RIGHT_WING_2PT' || selectedZone === 'RIGHT_WING_2PT' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave" d="M8.6 15 L 13 3 Q 20.5 6.5  24.5 13 L 16.2 18.1 Q 14 15.9  11 15.1 L8.6 15 " fill="none"></path>
                  <path @click="handleZoneClick('TOP_2PT')" @mouseover="highlightZone('TOP_2PT')" :fill="highlightedZone === 'TOP_2PT' || selectedZone === 'TOP_2PT' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave" d="M24.5 13 Q31 25  24.5 37 L 16.3 31.9 Q 21.7 25 16.3 18.1" fill="none"></path>
                  <path @click="handleZoneClick('LEFT_CORNER_2PT')" @mouseover="highlightZone('LEFT_CORNER_2PT')" :fill="highlightedZone === 'LEFT_CORNER_2PT' || selectedZone === 'LEFT_CORNER_2PT' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave" transform="scale(1, -1) translate(0, -50)" d="M0 3 L 13 3 L 8.6 15 L0 15" fill="none"></path>
                  <path @click="handleZoneClick('LEFT_WING_2PT')" @mouseover="highlightZone('LEFT_WING_2PT')" :fill="highlightedZone === 'LEFT_WING_2PT' || selectedZone === 'LEFT_WING_2PT' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave" transform="scale(1, -1) translate(0, -50)" d="M8.6 15 L 13 3 Q 20.5 6.5  24.5 13 L 16.2 18.1 Q 14 15.9  11 15.1 L8.6 15 " fill="none"></path>

                  <path @click="handleZoneClick('RIGHT_LOW_POST_2PT')" @mouseover="highlightZone('RIGHT_LOW_POST_2PT')" :fill="highlightedZone === 'RIGHT_LOW_POST_2PT' || selectedZone === 'RIGHT_LOW_POST_2PT' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave" d="M0 15 L 8.7 15 L 11 15.2 L 12.87 15.73 L8.24 21.2 L 6.5 21 L 0 21" fill="none"></path>
                  <path @click="handleZoneClick('HIGH_POST_2PT')" @mouseover="highlightZone('HIGH_POST_2PT')" :fill="highlightedZone === 'HIGH_POST_2PT' || selectedZone === 'HIGH_POST_2PT' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave" d="M8.24 21.2 L 12.87 15.73 Q 18.5 18.3  19 25.1 L 11  25.1 Q 11 22  8.24 21.2" fill="none"></path>
                  <path @click="handleZoneClick('HIGH_POST_2PT')" @mouseover="highlightZone('HIGH_POST_2PT')" :fill="highlightedZone === 'HIGH_POST_2PT' || selectedZone === 'HIGH_POST_2PT' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave" transform="scale(1, -1) translate(0, -50)" d="M8.24 21.2 L 12.87 15.73 Q 18.5 18.3  19 25.1 L 11  25.1 Q 11 22  8.24 21.2" fill="none"></path>
                  <path @click="handleZoneClick('LEFT_LOW_POST_2PT')" @mouseover="highlightZone('LEFT_LOW_POST_2PT')" :fill="highlightedZone === 'LEFT_LOW_POST_2PT' || selectedZone === 'LEFT_LOW_POST_2PT' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave" transform="scale(1, -1) translate(0, -50)" d="M0 15 L 8.7 15 L 11 15.2 L 12.87 15.73 L8.24 21.2 L 6.5 21 L 0 21" fill="none"></path>

                  <path @click="handleZoneClick('UNDER_BASKET_2PT')" @mouseover="highlightZone('UNDER_BASKET_2PT')" :fill="highlightedZone === 'UNDER_BASKET_2PT' || selectedZone === 'UNDER_BASKET_2PT' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave" d="M0 21 L 7 21 Q 11 21.5  11 25 Q 11 28.5  7 29 L 0 29" fill="none"></path>


                  <!-- center Circle -->
                  <path
                      :d="describeArc(47, 25, 5.5, 180, 360)"
                      fill="none"
                      stroke="black"
                      stroke-width="0.2"
                  />
                  <line x1="47" y1="0" x2="47" y2="50" stroke="black" stroke-width="0.2"/>

                  <!-- free throw lane (Left) -->
                  <rect x="0" y="17" width="19" height="16" stroke="black" stroke-width="0.2" fill="none"/>

                  <path
                      :d="describeArc(19, 25, 6, 0, 180)"
                      fill="none"
                      stroke="black"
                      stroke-width="0.2"
                  />
                  <path
                      :d="describeArc(19, 25, 6, 180, 360)"
                      fill="none"
                      stroke="black"
                      stroke-width="0.2"
                      stroke-dasharray="0.9,0.9"
                  />

                  <!--      backboard left-->
                  <line x1="4" y1="22" x2="4" y2="28" stroke="black" stroke-width="0.2"/>
                  <circle cx="5" cy="25" r="1" stroke="black" stroke-width="0.2" fill="none"/>


                  <!--      Restricted area left-->
                  <path
                      :d="describeArc(5, 25, 4, 0, 180)"
                      fill="none"
                      stroke="black"
                      stroke-width="0.2"
                  />

                  <!--      Three point line left-->
                  <path
                      :d="describeArc(4, 25, 23.75, 22, 158)"
                      fill="none"
                      stroke="black"
                      stroke-width="0.2"
                  />
                  <line x1="0" y1="3" x2="13" y2="3" stroke="black" stroke-width="0.2"/>
                  <line x1="0" y1="47" x2="13" y2="47" stroke="black" stroke-width="0.2"/>


                  <!--      timeout hash-->
                  <line x1="28" y1="0" x2="28" y2="3" stroke="black" stroke-width="0.2"/>
                  <line x1="28" y1="47" x2="28" y2="50" stroke="black" stroke-width="0.2"/>

                  <!--      key hash left-->
                  <line x1="7" y1="17" x2="7" y2="16.5" stroke="black" stroke-width="0.2"/>
                  <line x1="8" y1="17" x2="8" y2="16.5" stroke="black" stroke-width="0.2"/>
                  <line x1="12" y1="17" x2="12" y2="16.5" stroke="black" stroke-width="0.2"/>
                  <line x1="15.5" y1="17" x2="15.5" y2="16.5" stroke="black" stroke-width="0.2"/>

                  <line x1="7" y1="33" x2="7" y2="33.5" stroke="black" stroke-width="0.2"/>
                  <line x1="8" y1="33" x2="8" y2="33.5" stroke="black" stroke-width="0.2"/>
                  <line x1="12" y1="33" x2="12" y2="33.5" stroke="black" stroke-width="0.2"/>
                  <line x1="15.5" y1="33" x2="15.5" y2="33.5  " stroke="black" stroke-width="0.2"/>




                  <!--    lines temp-->
                  <!--    <line x1="5" y1="25" x2="13" y2="3" stroke="red" stroke-width="0.2"></line>-->
                  <line x1="8.6" y1="15" x2="13" y2="3" stroke="white" stroke-width="0.2"></line>
                  <!--    <line x1="5" y1="25" x2="24.5" y2="13" stroke="red" stroke-width="0.2"></line>-->
                  <line x1="16.2" y1="18.1" x2="24.5" y2="13" stroke="white" stroke-width="0.2"></line>
                  <!--    <line x1="5" y1="25" x2="24.5" y2="37" stroke="red" stroke-width="0.2"></line>-->
                  <line transform="scale(1, -1) translate(0, -50)" x1="8.6" y1="15" x2="13" y2="3" stroke="white" stroke-width="0.2"></line>
                  <!--    <line x1="5" y1="25" x2="13" y2="47" stroke="red" stroke-width="0.2"></line>-->
                  <line transform="scale(1, -1) translate(0, -50)" x1="16.2" y1="18.1" x2="24.5" y2="13" stroke="white" stroke-width="0.2"></line>
                  <path
                      :d="describeArc(9, 25, 10, 0, 180)"
                      fill="none"
                      stroke="white"
                      stroke-width="0.2"
                  />
                  <line x1="0" y1="15" x2="9" y2="15" stroke="white" stroke-width="0.2"></line>
                  <line x1="0" y1="35" x2="9" y2="35" stroke="white" stroke-width="0.2"></line>
                  <path
                      :d="describeArc(7, 25, 4, 0, 180)"
                      fill="none"
                      stroke="white"
                      stroke-width="0.2"
                  />
                  <line x1="0" y1="21" x2="7" y2="21" stroke="white" stroke-width="0.2"></line>
                  <line x1="0" y1="29" x2="7" y2="29" stroke="white" stroke-width="0.2"></line>

                  <!--    <line x1="5" y1="25" x2="22" y2="5" stroke="yellow" stroke-width="0.2"></line>-->
                  <line x1="8.24" y1="21.2" x2="12.87" y2="15.73" stroke="white" stroke-width="0.2"></line>
                  <line transform="scale(1, -1) translate(0, -50)" x1="8.24" y1="21.2" x2="12.87" y2="15.73" stroke="white" stroke-width="0.2"></line>

                  <line x1="13" y1="0" x2="13" y2="3" stroke="white" stroke-width="0.2"></line>
                  <line x1="24.5" y1="13" x2="39" y2="13" stroke="white" stroke-width="0.2"></line>
                  <line x1="24.5" y1="37" x2="39" y2="37" stroke="white" stroke-width="0.2"></line>
                  <line x1="13" y1="47" x2="13" y2="50" stroke="white" stroke-width="0.2"></line>
                  <!--    <line x1="38" y1="0" x2="38" y2="50" stroke="white" stroke-width="0.2"></line>-->

                  <path :d="describeArc(4.75, 25, 36.24, 0, 180)" fill="none" stroke="white" stroke-width="0.2"></path>


                  <!--      bounds-->
                  <line x1="0" y1="0.1" x2="47" y2="0.1" stroke="black" stroke-width="0.2"/>
                  <line x1="0" y1="49.9" x2="47" y2="49.9" stroke="black" stroke-width="0.2"/>
                  <line x1="0" y1="0" x2="0" y2="50" stroke="black" stroke-width="0.2"/>
                  <line x1="47" y1="0.1" x2="47" y2="50" stroke="black" stroke-width="0.2"/>


                </svg>
              </div>
              <div class="col-4 text-center">
                <div class="d-flex my-3" v-for="player in awayLineUp">
                  <div class="card col-2 no-overflow">
                    #{{player.shirtNumber}}
                  </div>
                  <div class="card col-9 no-overflow custom-btn-light" :class="{'custom-btn-light-selected' : selectedPlayer === player}" @click="clickPlayerSelected(player)">
                    {{player.firstName.substring(0,1)}}. {{player.lastName}}
                  </div>
                  <div class="card col-1 no-overflow d-flex justify-content-center custom-btn-light" :class="{'custom-btn-light-selected' : awayLineUpSelectedPlayer === player}">
                    <i class="fa-solid fa-rotate" @click="clickSwapPlayerIcon(player,'away')"></i>
                  </div>
                </div>
              </div>

              <div v-if="awayLineUpSelectedPlayer !== null" class="card p-2 text-center" style="position: absolute;top: 22.6%;left: 57%;width: 16%;z-index: 1000; background-color: #fafafa" >
                <div class="d-flex" v-for="player in awayBench">
                  <div class="card col-2 no-overflow">
                    #{{player.shirtNumber}}
                  </div>
                  <div class="card col-9 no-overflow custom-btn-light">
                    {{player.firstName.substring(0,1)}}. {{player.lastName}}
                  </div>

                  <div class="card col-1 no-overflow d-flex justify-content-center custom-btn-light" :class="{'custom-btn-light-selected' : awayBenchSelectedPlayer === player}">
                    <i class="fa-solid fa-rotate" @click="awayBenchSelectedPlayer=player"></i>
                  </div>
                </div>
                <div class="d-flex justify-content-center mt-2">
                  <button @click="awayLineUpSelectedPlayer = null ; awayBenchSelectedPlayer = null" class="btn btn-outline-danger d-flex align-items-center justify-content-center" style="height: 10px">
                    <i class="fa-solid fa-xmark" style="font-size: 10px"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="col-5">

              <div class="col" :class="{'disabled' : playToEdit !== null}">
                <div class="row">
                  <div class="col">
                    <div class="card mt-1">
                      <div class="d-flex justify-content-between" :class="{'disabled' : selectedPlayer === null}">
                        <button class="btn btn-light w-100 small-text" :class="{'custom-btn-light-selected' : selectedPlay === 'SHOTPLAY'}" @click=handlePlaySelect($event.target.innerText)>SHOTPLAY</button>
                        <button class="btn btn-light w-100 small-text" :class="{'custom-btn-light-selected' : selectedPlay === 'ASSIST'}" @click=handlePlaySelect($event.target.innerText)>ASSIST</button>
                        <button class="btn btn-light w-100 small-text" :class="{'custom-btn-light-selected' : selectedPlay === 'REBOUND'}" @click=handlePlaySelect($event.target.innerText)>REBOUND</button>
                        <button class="btn btn-light w-100 small-text" :class="{'custom-btn-light-selected' : selectedPlay === 'VIOLATION'}" @click="handlePlaySelect($event.target.innerText)">VIOLATION</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="card mt-1">
                      <div class="d-flex justify-content-between" :class="{'disabled' : selectedPlayer === null}">
                        <button class="btn btn-light w-100 small-text" :class="{'custom-btn-light-selected' : selectedPlay === 'FOUL'}" @click=handlePlaySelect($event.target.innerText)>FOUL</button>
                        <button class="btn btn-light w-100 small-text" :class="{'custom-btn-light-selected' : selectedPlay === 'STEAL'}" @click=handlePlaySelect($event.target.innerText)>STEAL</button>
                        <button class="btn btn-light w-100 small-text" :class="{'custom-btn-light-selected' : selectedPlay === 'TURNOVER'}" @click=handlePlaySelect($event.target.innerText)>TURNOVER</button>
                        <button class="btn btn-light w-100 small-text" :class="{'custom-btn-light-selected' : selectedPlay === 'BLOCK'}" @click=handlePlaySelect($event.target.innerText)>BLOCK</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row mt-3">
                  <div class="col">
                    <div class="card">
                      <div class="d-flex justify-content-between">
                        <button @click="toggleCountdown" class="btn btn-light w-100 small-text">Start/Stop</button>
                        <button @click="handleSaveGame" class="btn btn-light w-100 small-text">Save</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div class="row">
            <div class="col">
              <div class="card small-text text-center mb-2">
                <div class="card-header" >
                  <div class="d-flex">
                    <div class="col-4">
                      <input class="form-control small-text text-center w-75" readonly value="Play by play">

                    </div>
                    <div class="col-8 d-flex">
                      <input class="form-control small-text text-center w-50" readonly value="Quarter:">
                      <select class="small-text custom-input w-25">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                      </select>
                    </div>
                  </div>

                </div>
                <div class="card-body scrollable" id="divToScroll">
                  <Notification v-if="showNotification" :message="notificationMessage" :successful="isNotificationSuccessful" style="position: absolute; top: 25%; left: 5%; width: 90%; pointer-events: none; z-index: 999"></Notification>
                  <div class="row highlight" v-for="play in game.plays" @click="handleEditPlaySelect(play)"  :class="{'custom-btn-light-selected': playToEdit === play, 'no-action': selectedPlay !== null}" >
                    <!--                    @click="handleEditPlaySelect(play)" :class="{'custom-btn-light-selected' : playToEdit === play}"-->
                    <div class="col-2">
                      {{play.formattedTime}}
                    </div>
                    <div class="col-4 no-overflow">
                      {{play.firstName.substring(0,1) + '. ' + play.lastName}}
                    </div>
                    <div class="col-3 no-overflow">
                      {{play.playType}}
                    </div>
                    <div class="col-3 no-overflow">
                      {{ play.describe() }}
                    </div>
                  </div>
                  <div v-if="playToEdit !== null" class="container mt-2" style="position: absolute; z-index: 1000; top: -15%; left: 0;">
                    <div class="card">
                      <div class="card-header d-flex" style="height: 45px">
                        <div class="form-control small-text w-25 text-center">{{playToEdit.playType}}</div>
<!--                        <select-->
<!--                            id="season-select" class="form-control w-50 small-text text-center" v-model="playToEdit.statPlayerId">-->
<!--                          <option v-for="player in allPlayers" :value="player.statPlayerId">-->
<!--                            {{ player.firstName + ' ' + player.lastName }}-->
<!--                          </option>-->
<!--                        </select>-->
                        <div class="form-control small-text w-50 text-center">{{playToEdit.firstName + ' ' + playToEdit.lastName}}</div>
                        <button @click="handlePlayClick(playToEdit.playType)" class="btn btn-outline-success small small-text w-25">Save</button>
                      </div>
                      <div class="card-body p-1">
                        <template v-if="playToEdit.playType === 'SHOTPLAY'">
                          <ShotPlaySelector @update:shotPlay="handlePlayEmit($event)" :data="playToEdit" :selected-zone="selectedZone" :game-id="game.id" :zones="zoneTypes" :quarter="currentQuarter" :time-stamp="currentTimeStampInMs" :player="findPlayerToSelectWhenEditingPlay(playToEdit.statPlayerId)" :contested="contestedTypes" :hands="handTypes" :types="shotTypes"></ShotPlaySelector>
                        </template>
                        <template v-else-if="playToEdit.playType === 'ASSIST'">
                          <AssistSelector @update:assist="handlePlayEmit($event)" :data="playToEdit" :possible-assisted-players="allPlayers" :game-id="game.id" :quarter="currentQuarter" :time-stamp="currentTimeStampInMs" :player="findPlayerToSelectWhenEditingPlay(playToEdit.statPlayerId)" :hands="handTypes" :types="assistTypes"></AssistSelector>
                        </template>
                        <template v-else-if="playToEdit.playType === 'BLOCK'">
                          <BlockSelector @update:block="handlePlayEmit($event)" :data="playToEdit" :possible-block-on-players="allPlayers" :game-id="game.id" :quarter="currentQuarter" :time-stamp="currentTimeStampInMs" :player="findPlayerToSelectWhenEditingPlay(playToEdit.statPlayerId)" :hands="handTypes"></BlockSelector>
                        </template>
                        <template v-else-if="playToEdit.playType === 'FOUL'">
                          <FoulSelector @update:foul="handlePlayEmit($event)" :data="playToEdit" :possible-foul-on-players="allPlayers" :types="foulTypes" :game-id="game.id" :quarter="currentQuarter" :time-stamp="currentTimeStampInMs" :player="findPlayerToSelectWhenEditingPlay(playToEdit.statPlayerId)" :hands="handTypes"></FoulSelector>
                        </template>
                        <template v-else-if="playToEdit.playType === 'REBOUND'">
                          <ReboundSelector @update:rebound="handlePlayEmit($event)" :data="playToEdit" :game-id="game.id" :quarter="currentQuarter" :time-stamp="currentTimeStampInMs" :player="findPlayerToSelectWhenEditingPlay(playToEdit.statPlayerId)" :hands="handTypes"></ReboundSelector>
                        </template>
                        <template v-else-if="playToEdit.playType === 'STEAL'">
                          <StealSelector @update:steal="handlePlayEmit($event)" :data="playToEdit" :possible-turnover-for-players="allPlayers" :game-id="game.id" :quarter="currentQuarter" :time-stamp="currentTimeStampInMs" :player="findPlayerToSelectWhenEditingPlay(playToEdit.statPlayerId)" :hands="handTypes"></StealSelector>
                        </template>
                        <template v-else-if="playToEdit.playType === 'TURNOVER'">
                          <TurnoverSelector @update:turnover="handlePlayEmit($event)" :data="playToEdit" :possible-steal-on-players="allPlayers" :types="turnoverTypes" :game-id="game.id" :quarter="currentQuarter" :time-stamp="currentTimeStampInMs" :player="findPlayerToSelectWhenEditingPlay(playToEdit.statPlayerId)" :hands="handTypes"></TurnoverSelector>
                        </template>
                        <template v-else-if="playToEdit.playType === 'VIOLATION'">
                          <ViolationSelector @update:violation="handlePlayEmit($event)" :data="playToEdit" :types="violationTypes" :game-id="game.id" :quarter="currentQuarter" :time-stamp="currentTimeStampInMs" :player="findPlayerToSelectWhenEditingPlay(playToEdit.statPlayerId)" :hands="handTypes"></ViolationSelector>
                        </template>
                        <div class="d-flex justify-content-center mb-1">
                          <button @click="handleEditPlaySelect(playToEdit)" class="btn btn-outline-danger d-flex align-items-center justify-content-center" style="height: 10px">
                            <i class="fa-solid fa-xmark" style="font-size: 10px"></i>
                          </button>
                        </div>
                        {{createdPlay}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-5">
              <div class="card">
                <div class="card-header d-flex justify-content-center" style="height: 45px">
                  <div class="form-control small-text w-25 text-center" :class="{'reduced-opacity' : selectedPlay === null}" >{{ selectedPlay !== null ? selectedPlay : 'Select play' }}</div>
                  <div class="form-control small-text w-50 text-center no-overflow" :class="{'reduced-opacity' : selectedPlayer === null}" >{{ selectedPlayer !== null ? selectedPlayer.firstName + ' ' + selectedPlayer.lastName : 'Select player' }}</div>
                  <button @click="handlePlayClick(selectedPlay)" class="btn btn-outline-success small small-text w-25">Add</button>
                </div>

                <div class="card-body p-1">
                  <template v-if="selectedPlay === 'SHOTPLAY'">
                    <ShotPlaySelector :data="playToEdit" @update:shotPlay="handlePlayEmit($event)" @update:isFreeThrowSelected="isFreeThrowSelected=$event" @update:selected-zone="selectedZone=$event" :quarter="currentQuarter" :selected-zone="selectedZone || 'NONE'" :zones="zoneTypes" :game-id="game.id" :contested="contestedTypes" :hands="handTypes" :time-stamp="currentTimeStampInMs" :types="shotTypes" :player="selectedPlayer"></ShotPlaySelector>
                  </template>
                  <template v-if="selectedPlay === 'ASSIST'">
                    <AssistSelector @update:assist="handlePlayEmit($event)" :quarter="currentQuarter" :possible-assisted-players="getCurrentTeamPlayers" :time-stamp="currentTimeStampInMs" :types="assistTypes" :game-id="game.id" :hands="handTypes" :player="selectedPlayer"></AssistSelector>
                  </template>
                  <template v-if="selectedPlay === 'REBOUND'">
                    <ReboundSelector @update:rebound="handlePlayEmit($event)" :quarter="currentQuarter" :game-id="game.id" :time-stamp="currentTimeStampInMs" :player="selectedPlayer" :hands="handTypes"></ReboundSelector>
                  </template>
                  <template v-if="selectedPlay === 'FOUL'">
                    <FoulSelector @update:foul="handlePlayEmit($event)" :quarter="currentQuarter" :possible-foul-on-players="getOpposingTeamPlayers" :types="foulTypes" :game-id="game.id" :time-stamp="currentTimeStampInMs" :player="selectedPlayer" :hands="handTypes"></FoulSelector>
                  </template>
                  <template v-if="selectedPlay === 'STEAL'">
                    <StealSelector @update:steal="handlePlayEmit($event)" :quarter="currentQuarter" :possible-turnover-for-players="getOpposingTeamPlayers" :game-id="game.id" :time-stamp="currentTimeStampInMs" :player="selectedPlayer" :hands="handTypes"></StealSelector>
                  </template>
                  <template v-if="selectedPlay === 'TURNOVER'">
                    <TurnoverSelector @update:turnover="handlePlayEmit($event)" :quarter="currentQuarter" :possible-steal-on-players="getOpposingTeamPlayers" :types="turnoverTypes" :game-id="game.id" :time-stamp="currentTimeStampInMs" :player="selectedPlayer" :hands="handTypes"></TurnoverSelector>
                  </template>
                  <template v-if="selectedPlay === 'BLOCK'">
<!--                    @update:play-submission="handlePlaySubmissionEmit($event)"-->
                    <BlockSelector @update:block="handlePlayEmit($event)" :quarter="currentQuarter" :possible-block-on-players="getOpposingTeamPlayers" :game-id="game.id" :time-stamp="currentTimeStampInMs" :player="selectedPlayer" :hands="handTypes"></BlockSelector>
                  </template>
                  <template v-if="selectedPlay === 'VIOLATION'">
                    <ViolationSelector @update:violation="handlePlayEmit($event)" :types="violationTypes" :game-id="game.id" :quarter="currentQuarter" :time-stamp="currentTimeStampInMs" :player="selectedPlayer" :hands="handTypes"></ViolationSelector>
                  </template>
                  <div v-if="selectedPlay !== null" class="d-flex justify-content-center mb-1">
                    <button @click="selectedPlayer = null ; selectedPlay = null; isFreeThrowSelected=false" class="btn btn-outline-danger d-flex align-items-center justify-content-center" style="height: 10px">
                      <i class="fa-solid fa-xmark" style="font-size: 10px"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'boxscore'">
        <div class="container shadow-lg scrollable" style="max-height: 416px">
          <div class="d-flex justify-content-center">
            <h5 class="mt-2">{{game.home.name}}</h5>
          </div>
          <hr class="my-2">
          <table class="table table-striped table-hover table-bordered small-text text-center">
            <thead>
            <tr>
              <th scope="col">No.</th>
              <th scope="col">Player</th>
              <th scope="col">S5</th>
              <th scope="col">PTS</th>
              <th scope="col" colspan="2">2PT</th>
              <th scope="col" colspan="2">3PT</th>
              <th scope="col" colspan="2">FT</th>
              <th scope="col" colspan="2">FG</th>
              <th scope="col">OR</th>
              <th scope="col">DF</th>
              <th scope="col">A</th>
              <th scope="col">F</th>
              <th scope="col">FF</th>
              <th scope="col">TO</th>
              <th scope="col">S</th>
              <th scope="col">B</th>
              <th scope="col">BR</th>
              <th scope="col">PS</th>
              <th scope="col">+/-</th>
              <th scope="col">Eval</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="player in game.home.players">
              <td>{{player.shirtNumber}}</td>
              <td>{{player.firstName +  ' ' + player.lastName}}</td>
              <td>{{ player.startingFive ? '1' : '0' }}</td>
              <td>{{player.stats.totalPoints}}</td>
              <td>{{player.stats.twoMade}} / {{player.stats.twoAttempted}}</td>
              <td>{{player.stats.percentage.twoPoint}} %</td>
              <td>{{player.stats.threeMade}} / {{player.stats.threeAttempted}}</td>
              <td>{{player.stats.percentage.threePoint}} % </td>
              <td>{{player.stats.freeThrowMade}} / {{player.stats.freeThrowAttempted}}</td>
              <td>{{player.stats.percentage.freeThrow}} %</td>
              <td>{{player.stats.twoMade + player.stats.threeMade}} / {{player.stats.twoAttempted + player.stats.threeAttempted}}</td>
              <td>{{player.stats.percentage.fieldGoal}} %</td>
              <td>{{player.stats.offRebounds}}</td>
              <td>{{player.stats.defRebounds}}</td>
              <td>{{player.stats.assists}}</td>
              <td>{{player.stats.fouls}}</td>
              <td>{{player.stats.forcedFouls}}</td>
              <td>{{player.stats.turnovers}}</td>
              <td>{{player.stats.steals}}</td>
              <td>{{player.stats.blocks}}</td>
              <td>{{player.stats.blocksReceived}}</td>
              <td>{{player.stats.possessions}}</td>
              <td>{{player.stats.plusMinus}}</td>
              <td>{{player.stats.evaluation}}</td>
            </tr>
            <tr>
              <td colspan="3">Totals</td>
              <td>{{game.home.stats.totalPoints}}</td>
              <td>{{game.home.stats.twoMade}} / {{game.home.stats.twoAttempted}}</td>
              <td>{{game.home.stats.percentage.twoPoint}} %</td>
              <td>{{game.home.stats.threeMade}} / {{game.home.stats.threeAttempted}}</td>
              <td>{{game.home.stats.percentage.threePoint}} % </td>
              <td>{{game.home.stats.freeThrowMade}} / {{game.home.stats.freeThrowAttempted}}</td>
              <td>{{game.home.stats.percentage.freeThrow}} %</td>
              <td>{{game.home.stats.twoMade + game.home.stats.threeMade}} / {{game.home.stats.twoAttempted + game.home.stats.threeAttempted}}</td>
              <td>{{game.home.stats.percentage.fieldGoal}} %</td>
              <td>{{game.home.stats.offRebounds}}</td>
              <td>{{game.home.stats.defRebounds}}</td>
              <td>{{game.home.stats.assists}}</td>
              <td>{{game.home.stats.fouls}}</td>
              <td>{{game.home.stats.forcedFouls}}</td>
              <td>{{game.home.stats.turnovers}}</td>
              <td>{{game.home.stats.steals}}</td>
              <td>{{game.home.stats.blocks}}</td>
              <td>{{game.home.stats.blocksReceived}}</td>
              <td>{{game.home.stats.possessions}}</td>
              <td>{{game.home.stats.plusMinus}}</td>
              <td>{{game.home.stats.evaluation}}</td>
            </tr>
            </tbody>
          </table>


          <div class="d-flex justify-content-center">
            <h5 class="mt-2">{{game.away.name}}</h5>
          </div>
          <hr class="my-2">
          <table class="table table-striped table-hover table-bordered small-text text-center">
            <thead>
            <tr>
              <th scope="col">No.</th>
              <th scope="col">Player</th>
              <th scope="col">S5</th>
              <th scope="col">PTS</th>
              <th scope="col" colspan="2">2PT</th>
              <th scope="col" colspan="2">3PT</th>
              <th scope="col" colspan="2">FT</th>
              <th scope="col" colspan="2">FG</th>
              <th scope="col">OR</th>
              <th scope="col">DF</th>
              <th scope="col">A</th>
              <th scope="col">F</th>
              <th scope="col">FF</th>
              <th scope="col">TO</th>
              <th scope="col">S</th>
              <th scope="col">B</th>
              <th scope="col">BR</th>
              <th scope="col">PS</th>
              <th scope="col">+/-</th>
              <th scope="col">Eval</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="player in game.away.players">
              <td>{{player.shirtNumber}}</td>
              <td>{{player.firstName +  ' ' + player.lastName}}</td>
              <td>{{ player.startingFive ? '1' : '0' }}</td>
              <td>{{player.stats.totalPoints}}</td>
              <td>{{player.stats.twoMade}} / {{player.stats.twoAttempted}}</td>
              <td>{{player.stats.percentage.twoPoint}} %</td>
              <td>{{player.stats.threeMade}} / {{player.stats.threeAttempted}}</td>
              <td>{{player.stats.percentage.threePoint}} % </td>
              <td>{{player.stats.freeThrowMade}} / {{player.stats.freeThrowAttempted}}</td>
              <td>{{player.stats.percentage.freeThrow}} %</td>
              <td>{{player.stats.twoMade + player.stats.threeMade}} / {{player.stats.twoAttempted + player.stats.threeAttempted}}</td>
              <td>{{player.stats.percentage.fieldGoal}} %</td>
              <td>{{player.stats.offRebounds}}</td>
              <td>{{player.stats.defRebounds}}</td>
              <td>{{player.stats.assists}}</td>
              <td>{{player.stats.fouls}}</td>
              <td>{{player.stats.forcedFouls}}</td>
              <td>{{player.stats.turnovers}}</td>
              <td>{{player.stats.steals}}</td>
              <td>{{player.stats.blocks}}</td>
              <td>{{player.stats.blocksReceived}}</td>
              <td>{{player.stats.possessions}}</td>
              <td>{{player.stats.plusMinus}}</td>
              <td>{{player.stats.evaluation}}</td>
            </tr>
            <tr>
              <td colspan="3">Totals</td>
              <td>{{game.away.stats.totalPoints}}</td>
              <td>{{game.away.stats.twoMade}} / {{game.away.stats.twoAttempted}}</td>
              <td>{{game.away.stats.percentage.twoPoint}} %</td>
              <td>{{game.away.stats.threeMade}} / {{game.away.stats.threeAttempted}}</td>
              <td>{{game.away.stats.percentage.threePoint}} % </td>
              <td>{{game.away.stats.freeThrowMade}} / {{game.away.stats.freeThrowAttempted}}</td>
              <td>{{game.away.stats.percentage.freeThrow}} %</td>
              <td>{{game.away.stats.twoMade + game.away.stats.threeMade}} / {{game.away.stats.twoAttempted + game.away.stats.threeAttempted}}</td>
              <td>{{game.away.stats.percentage.fieldGoal}} %</td>
              <td>{{game.away.stats.offRebounds}}</td>
              <td>{{game.away.stats.defRebounds}}</td>
              <td>{{game.away.stats.assists}}</td>
              <td>{{game.away.stats.fouls}}</td>
              <td>{{game.away.stats.forcedFouls}}</td>
              <td>{{game.away.stats.turnovers}}</td>
              <td>{{game.away.stats.steals}}</td>
              <td>{{game.away.stats.blocks}}</td>
              <td>{{game.away.stats.blocksReceived}}</td>
              <td>{{game.away.stats.possessions}}</td>
              <td>{{game.away.stats.plusMinus}}</td>
              <td>{{game.away.stats.evaluation}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-show="activeTab === 'options'">
        <div class="container shadow-lg">
          options
        </div>
      </div>

    </div>
  </div>
  <div v-else>
    <Loading></Loading>
  </div>
</template>

<style scoped>
.card-text {
  position: absolute;
  top: 41px;
  left: 50%;
  transform: translateX(-50%);
}
.card-white-background{
  background-color: transparent;
  color: white;
  border-color: white
}
.digital-text {
  font-family: Digital,serif;
  font-size: 35px;

}
.no-overflow{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.scrollable {
  max-height: 155px;
  overflow-y: auto;
}

.cursor-pointer{
  cursor: pointer;
}

.zone-color-select{
  color: red;
  background-color: red;
}
.highlight:hover {
  background-color: #f0f0f0; /* Kolor tła podczas najechania kursorem */
  cursor: pointer; /* Zmiana kursora na wskazujący */
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* półprzezroczyste tło */
  z-index: 1000; /* poniżej głównego elementu */
}
</style>
