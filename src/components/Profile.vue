<script setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const currentUser = store.state.auth.user;

if (!currentUser) {
  router.push('/login');
}
</script>

<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        <strong>{{ currentUser && currentUser.username ? currentUser.username : '' }}</strong> Profile
      </h3>
    </header>
    <p>
      <strong>Token:</strong>
      {{currentUser && currentUser.accessToken ? currentUser.accessToken.substring(0, 20) : ''}}
    </p>
    <p>
      <strong>Id:</strong>
      {{ currentUser && currentUser.id ? currentUser.id : '' }}
    </p>
    <p>
      <strong>Email:</strong>
      {{ currentUser && currentUser.email ? currentUser.email : '' }}
    </p>
    <strong>Authorities:</strong>
    <ul>
      <li v-for="(role,index) in currentUser.roles" :key="index">{{role}}</li>
    </ul>
  </div>
</template>
