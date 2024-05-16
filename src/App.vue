<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="navbar-nav mr-auto">
        <ul>
          <li class="nav-item">
            <router-link to="/home" class="nav-link">Home</router-link>
          </li>
          <li v-if="showAdminBoard" class="nav-item">
            <router-link to="/admin" class="nav-link">Admin Board</router-link>
          </li>
          <li v-if="showModeratorBoard" class="nav-item">
            <router-link to="/mod" class="nav-link">Moderator Board</router-link>
          </li>
          <li class="nav-item">
            <router-link v-if="currentUser" to="/user" class="nav-link">User</router-link>
          </li>
        </ul>
      </div>

      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <ol>
          <li class="nav-item">
            <router-link to="/register" class="nav-link">
              Sign Up
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link">
              Login
            </router-link>
          </li>
        </ol>
      </div>

      <div v-if="currentUser" class="navbar-nav ml-auto">
        <ol>
          <li class="nav-item">
            <router-link to="/profile" class="nav-link">
              {{ currentUser.username }}
            </router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href @click.prevent="logOut">
              LogOut
            </a>
          </li>
        </ol>
      </div>
    </nav>

    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script setup>
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import {computed} from "vue";

const store = useStore();
const router = useRouter();

const currentUser = computed(() => store.state.auth.user);

const showAdminBoard = computed(() => {
  if (currentUser.value && currentUser.value.roles) {
    return currentUser.value.roles.includes('ROLE_ADMIN');
  }
  return false;
});

const showModeratorBoard = computed(() => {
  if (currentUser.value && currentUser.value.roles) {
    return currentUser.value.roles.includes('ROLE_MODERATOR');
  }
  return false;
});

const logOut = computed(() => {
  store.dispatch('auth/logout');
  router.push('/login');
});
</script>

