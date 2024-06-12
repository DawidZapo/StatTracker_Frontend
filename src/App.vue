<script setup>
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import {computed} from "vue";

const store = useStore();
const router = useRouter();

const currentUser = computed(() => store.state.auth.user);

const showMenu = computed(() => {
  if (currentUser.value && currentUser.value.roles) {
    return currentUser.value.roles.includes('ROLE_USER');
  }
  return false;
});

const logOut = computed(() => {
  store.dispatch('auth/logout');
  router.push('/login');
});
</script>

<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="col-md-4 d-flex justify-content-center align-items-center">
        <ul class="navbar-nav mr-auto mx-4">
          <li class="nav-item">
            <router-link to="/home" class="nav-link">Home</router-link>
          </li>
          <template v-if="showMenu">
            <li class="nav-item">
              <router-link to="/teams" class="nav-link">Teams</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/players" class="nav-link">Players</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/games" class="nav-link">Games</router-link>
            </li>
          </template>
        </ul>
      </div>
      <div class="col-md-4 d-flex justify-content-center align-items-center">

      </div>
      <div class="col-md-4 d-flex justify-content-center align-items-center">
        <div v-if="!currentUser">
          <ul class="navbar-nav mr-auto mx-4">
            <li>
              <router-link to="/register" class="nav-link">
                Sign Up
              </router-link>
            </li>
            <li>
              <router-link to="/login" class="nav-link">
                Login
              </router-link>
            </li>
          </ul>
        </div>
        <div v-if="currentUser">
          <ul class="navbar-nav mr-auto mx-4">
            <li>
              <router-link to="/profile" class="nav-link">
                Profile
              </router-link>
            </li>
            <li>
              <a class="nav-link" href @click.prevent="logOut">
                LogOut
              </a>
            </li>
          </ul>
        </div>
      </div>

    </nav>

    <div>
      <router-view/>
    </div>
  </div>
</template>

<style scoped>

</style>
