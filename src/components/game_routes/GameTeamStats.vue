<script setup>

import {useStore} from "vuex";
import {computed} from "vue";

const store = useStore();
const selectedGameId = computed(()=> store.getters.selectedGameId);

</script>

<template>
  <div class="container shadow-lg">
    {{selectedGameId}}
    <div class="row d-flex justify-content-center event-info">
      <div class="col-4 text-center event-info">
        <div class="d-flex justify-content-between">
          <div>2024-05-04</div>
          <div class="line">|</div>
          <div>17:00</div>
          <div class="line">|</div>
          <div>Arena Osir</div>
          <div class="line">|</div>
          <div>Knurów</div>
        </div>
      </div>
    </div>
    <hr class="my-2"></hr>
    <div class="row">
        <div class="col-3 text-end d-flex align-items-center justify-content-end">
          <h1>KTK Knurów</h1>
        </div>
        <div class="col-6" style="align-content: center">
          <div class="row">
            <div class="col-4 text-end">
              <h1>80</h1>
            </div>
            <div class="col-4">
              <div class="row text-center event-info">
                <div class="d-flex justify-content-between">
                  <div>10</div>
                  <div>20</div>
                  <div>15</div>
                  <div>20</div>
                </div>
              </div>
              <div class="d-flex justify-content-between event-info">
                <div>10</div>
                <div>20</div>
                <div>15</div>
                <div>20</div>
              </div>
            </div>
            <div class="col-4 text-start">
              <h1>89</h1>
            </div>
          </div>
        </div>
        <div class="col-3 text-start d-flex align-items-center justify-content-start">
          <h1>Anwil Włocławek</h1>
        </div>
    </div>
  </div>
</template>

<style scoped>
.event-info {
  color: #6c757d;
  font-size: 1rem;
  font-weight: 400;
  /*font-family: "Oswald-Light";*/
}
.line{
  color: #C6C7C8FF;
}

</style>
