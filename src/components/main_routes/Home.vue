<script setup>
import { ref, onMounted } from 'vue';
import UserService from '../../services/user/user.service.js';
import BasketballCourt from "@/components/BasketballCourt.vue";

const content = ref('');

onMounted(() => {
  UserService.getPublicContent().then(
      response => {
        content.value = response.data;
      },
      error => {
        content.value =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
      }
  );
});
</script>


<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{content}}</h3>
    </header>
<!--    <BasketballCourt></BasketballCourt>-->
  </div>
</template>
