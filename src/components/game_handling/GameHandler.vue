<script setup>
import {computed, ref, watch} from 'vue';
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
import {getBenchPlayers, getStartingFive} from "@/assets/scripts/stats.js";

const store = useStore();
const selectedGameId = ref(localStorage.getItem('selectedGameId'));
const highlightedZone = ref(null);
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
const currentTimeStampInMs = computed(()=>{
  if(game.value.currentQuarter === 1){
    return game.value.currentQuarterTimeMs;
  }
  return ((game.value.currentQuarter - 1) * (game.value.quarterLengthMin * 60000)) + game.value.currentQuarterTimeMs;
});

const fetchGameToHandle = async (id) => {
  try{
    if(id){
      game.value = await GameService.fetchGameToHandle(id);

      homeLineUp.value = getStartingFive(game.value.home.players);
      homeBench.value = getBenchPlayers(game.value.home.players);

      awayLineUp.value = getStartingFive(game.value.away.players);
      awayBench.value = getBenchPlayers(game.value.away.players);

    }
  }catch (error) {
    console.error("Error while fetching game to handle: " + error);
    game.value = null;
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
  }
  catch (error) {
    console.error('Error while fetching types of:' + error);
  }
};

fetchGameToHandle(selectedGameId.value);
fetchTypes();

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
};

const highlightZone = (zone) => {
  highlightedZone.value = zone;
};

const handleMouseLeave = () => {
  highlightedZone.value = null;
};

const activeTab = ref('panel');

const clickPlayerSelected = (player) => {
  if(selectedPlayer.value === player){
    selectedPlayer.value = null;
    selectedPlay.value = null;
    return;
  }
  selectedPlayer.value = player;
}

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


</script>

<template>
  <div v-if="game !== null">
    <div class="text-center navbar navbar-expand navbar-dark bg-dark">
      <div class="col-4">
        <div class="d-flex">
          <div class="col-10">
            <div class="card card-white-background">
              <div style="font-size: 35px;" class="no-overflow">Anwile</div>
            </div>
          </div>
          <div class="col-2">
            <div class="card card-white-background">
              <div class="digital-text">120</div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="d-flex">
          <div class="col-3"></div>
          <div class="col-5">
            <div class="card card-white-background">
              <div class="digital-text">10:00:00</div>
            </div>
          </div>
          <div class="col-1">
            <div class="card card-white-background">
              <div class="digital-text">4</div>
            </div>
          </div>
          <div class="col-3"></div>
        </div>
      </div>
      <div class="col-4">
        <div class="d-flex justify-content-end">
          <div class="col-2">
            <div class="card card-white-background">
              <div class="digital-text">98</div>
            </div>
          </div>
          <div class="col-10">
            <div class="card card-white-background">
              <div style="font-size: 35px;" class="no-overflow">KTK Knurow</div>
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
              <div class="col-4 d-flex justify-content-center">
                <svg
                    viewBox="0 0 47 50"
                    xmlns="http://www.w3.org/2000/svg"
                    width="200"
                    height="200"
                    transform="rotate(90)">


                  <!-- background -->
                  <rect width="100%" height="100%" fill="tan"/>


                  <!--    zones-->
                  <path @mouseover="highlightZone('back-court')" d="M38 0 L 47 0 L 47 25.5 L41 25.5 Q 41 18 39 13 Q36 5 31 0" :fill="highlightedZone === 'back-court' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave"></path>
                  <path @mouseover="highlightZone('back-court')" transform="scale(1, -1) translate(0, -50)" d="M38 0 L 47 0 L 47 25 L41 25 Q 41 18 39 13 Q36 5 31 0" :fill="highlightedZone === 'back-court' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave"></path>

                  <path @mouseover="highlightZone('right-corner-3pt')" d="M0 0 H13 V3 H0 L 0 0" :fill="highlightedZone === 'right-corner-3pt' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave"></path>
                  <path @mouseover="highlightZone('right-wing-3pt')" d="M13 0 L31 0 Q 36 5 39 13 L24.5 13 Q 20.5 6.2 13 3" :fill="highlightedZone === 'right-wing-3pt' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave"></path>
                  <path @mouseover="highlightZone('top-3pt')" d="M24.5 13 L 39 13 Q 43 25  39 37 L 24.5 37 Q 30.9 25 24.5 13" :fill="highlightedZone === 'top-3pt' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave"></path>
                  <path @mouseover="highlightZone('left-wing-3pt')" transform="scale(1, -1) translate(0, -50)" d="M13 0 L31 0 Q 36 5 39 13 L24.5 13 Q 20.5 6.2 13 3" :fill="highlightedZone === 'left-wing-3pt' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave"></path>
                  <path @mouseover="highlightZone('left-corner-3pt')" transform="scale(1, -1) translate(0, -50)" d="M0 0 H13 V3 H0 L 0 0" :fill="highlightedZone === 'left-corner-3pt' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave"></path>

                  <path @mouseover="highlightZone('right-corner-2pt')" :fill="highlightedZone === 'right-corner-2pt' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave" d="M0 3 L 13 3 L 8.6 15 L0 15" fill="none"></path>
                  <path @mouseover="highlightZone('right-wing-2pt')" :fill="highlightedZone === 'right-wing-2pt' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave" d="M8.6 15 L 13 3 Q 20.5 6.5  24.5 13 L 16.2 18.1 Q 14 15.9  11 15.1 L8.6 15 " fill="none"></path>
                  <path @mouseover="highlightZone('top-2pt')" :fill="highlightedZone === 'top-2pt' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave" d="M24.5 13 Q31 25  24.5 37 L 16.3 31.9 Q 21.7 25 16.3 18.1" fill="none"></path>
                  <path @mouseover="highlightZone('left-wing-2pt')" :fill="highlightedZone === 'left-wing-2pt' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave" transform="scale(1, -1) translate(0, -50)" d="M0 3 L 13 3 L 8.6 15 L0 15" fill="none"></path>
                  <path @mouseover="highlightZone('left-corner-2pt')" :fill="highlightedZone === 'left-corner-2pt' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave" transform="scale(1, -1) translate(0, -50)" d="M8.6 15 L 13 3 Q 20.5 6.5  24.5 13 L 16.2 18.1 Q 14 15.9  11 15.1 L8.6 15 " fill="none"></path>

                  <path @mouseover="highlightZone('right-low-post')" :fill="highlightedZone === 'right-low-post' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave" d="M0 15 L 8.7 15 L 11 15.2 L 12.87 15.73 L8.24 21.2 L 6.5 21 L 0 21" fill="none"></path>
                  <path @mouseover="highlightZone('high-post')" :fill="highlightedZone === 'high-post' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave" d="M8.24 21.2 L 12.87 15.73 Q 18.5 18.3  19 25.1 L 11  25.1 Q 11 22  8.24 21.2" fill="none"></path>
                  <path @mouseover="highlightZone('high-post')" :fill="highlightedZone === 'high-post' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave" transform="scale(1, -1) translate(0, -50)" d="M8.24 21.2 L 12.87 15.73 Q 18.5 18.3  19 25.1 L 11  25.1 Q 11 22  8.24 21.2" fill="none"></path>
                  <path @mouseover="highlightZone('left-low-post')" :fill="highlightedZone === 'left-low-post' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave" transform="scale(1, -1) translate(0, -50)" d="M0 15 L 8.7 15 L 11 15.2 L 12.87 15.73 L8.24 21.2 L 6.5 21 L 0 21" fill="none"></path>

                  <path @mouseover="highlightZone('under-basket')" :fill="highlightedZone === 'under-basket' ? 'green' : 'transparent'" @mouseleave="handleMouseLeave" d="M0 21 L 7 21 Q 11 21.5  11 25 Q 11 28.5  7 29 L 0 29" fill="none"></path>


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
              <div class="card small-text text-center">
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
                <div class="card-body scrollable">
                  <div class="row" v-for="play in 20">
                    <div class="col-3">
                      06:00:23
                    </div>
                    <div class="col-3 no-overflow">
                        D. Zapotoczny
                    </div>
                    <div class="col-3 no-overflow">
                      Made 3pt
                    </div>
                    <div class="col-3 no-overflow">
                      action
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <div class="card">
                <div class="d-flex justify-content-between" :class="{'disabled' : selectedPlayer === null}">
                  <button class="btn btn-light w-100 small-text" :class="{'custom-btn-light-selected' : selectedPlay === 'Shot'}" @click="selectedPlay=$event.target.innerText">Shot</button>
                  <button class="btn btn-light w-100 small-text" :class="{'custom-btn-light-selected' : selectedPlay === 'Assist'}" @click="selectedPlay=$event.target.innerText">Assist</button>
                  <button class="btn btn-light w-100 small-text" :class="{'custom-btn-light-selected' : selectedPlay === 'Rebound'}" @click="selectedPlay=$event.target.innerText">Rebound</button>
                  <button class="btn btn-light w-100 small-text" :class="{'custom-btn-light-selected' : selectedPlay === 'Foul'}" @click="selectedPlay=$event.target.innerText">Foul</button>
                  <button class="btn btn-light w-100 small-text" :class="{'custom-btn-light-selected' : selectedPlay === 'Steal'}" @click="selectedPlay=$event.target.innerText">Steal</button>
                  <button class="btn btn-light w-100 small-text" :class="{'custom-btn-light-selected' : selectedPlay === 'Turnover'}" @click="selectedPlay=$event.target.innerText">Turnover</button>
                  <button class="btn btn-light w-100 small-text" :class="{'custom-btn-light-selected' : selectedPlay === 'Block'}" @click="selectedPlay=$event.target.innerText">Block</button>
                </div>
                <div class="row">

                </div>
              </div>
            </div>
            <div class="col-5">
              <div class="card">
                <div class="card-header d-flex justify-content-center" style="height: 45px">
                  <div class="form-control small-text w-25 text-center" :class="{'reduced-opacity' : selectedPlay === null}" >{{ selectedPlay !== null ? selectedPlay : 'Select play' }}</div>
                  <div class="form-control small-text w-50 text-center" :class="{'reduced-opacity' : selectedPlayer === null}" >{{ selectedPlayer !== null ? selectedPlayer.firstName + ' ' + selectedPlayer.lastName : 'Select player' }}</div>
                </div>

                <div class="card-body p-1">
                  <template v-if="selectedPlay === 'Shot'">
                    <ShotPlaySelector :zones="zoneTypes" :game-id="game.id" :contested="contestedTypes" :hands="handTypes" :time-stamp="currentTimeStampInMs" :types="shotTypes" :player="selectedPlayer"></ShotPlaySelector>
                  </template>
                  <template v-if="selectedPlay === 'Assist'">
                    <AssistSelector :types="assistTypes"></AssistSelector>
                  </template>
                  <template v-if="selectedPlay === 'Rebound'">
                    <ReboundSelector></ReboundSelector>
                  </template>
                  <template v-if="selectedPlay === 'Foul'">
                    <FoulSelector></FoulSelector>
                  </template>
                  <template v-if="selectedPlay === 'Steal'">
                    <StealSelector></StealSelector>
                  </template>
                  <template v-if="selectedPlay === 'Turnover'">
                    <TurnoverSelector></TurnoverSelector>
                  </template>
                  <template v-if="selectedPlay === 'Block'">
                    <BlockSelector></BlockSelector>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'boxscore'">
        <div class="container shadow-lg">
          boxscore
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

/*.custom-nav-tabs .nav-item .nav-link {*/
/*  background-color: white; !* kolor tła *!*/
/*  color: grey; !* kolor tekstu *!*/
/*  border-color: #dee2e6; !* kolor obramowania *!*/
/*}*/

/*.custom-nav-tabs .nav-item .nav-link.active {*/
/*  background-color: #f8f8f8; !* kolor tła dla aktywnej zakładki *!*/
/*  color: black; !* kolor tekstu dla aktywnej zakładki *!*/
/*  !*border-color: #007bff; !* kolor obramowania dla aktywnej zakładki *!*!*/
/*}*/
.scrollable {
  max-height: 155px;
  overflow-y: auto;
}



</style>
