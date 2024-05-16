<script setup>
import { ref, onMounted } from 'vue';
import UserService from '../services/user.service';

const content = ref('');

onMounted(() => {
  UserService.getAdminBoard().then(
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
  </div>
</template>
