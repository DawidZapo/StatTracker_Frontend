<script setup>
import { ref, computed, onMounted } from 'vue';
import User from '../models/user';
import store from "@/store/index.js";

const user = ref(new User('', ''));
const loading = ref(false);
const message = ref('');

const loggedIn = computed(() => store.state.auth.status.loggedIn);

const handleLogin = () => {
  loading.value = true;
  validator.value.validateAll().then(isValid => {
    if (!isValid) {
      loading.value = false;
      return;
    }

    if (user.value.username && user.value.password) {
      store.dispatch('auth/login', user.value).then(
          () => {
            router.push('/profile');
          },
          error => {
            loading.value = false;
            message.value =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
          }
      );
    }
  });
};

onMounted(() => {
  if (loggedIn.value) {
    router.push('/profile');
  }
});
</script>

<template>
  <div class="col-md-12">
    <div class="card card-container">
      <form name="form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username</label>
          <input
              v-model="user.username"
              v-validate="'required'"
              type="text"
              class="form-control"
              name="username"
          />
          <div
              v-if="errors.has('username')"
              class="alert alert-danger"
              role="alert"
          >Username is required!</div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
                v-model="user.password"
                v-validate="'required'"
                type="password"
                class="form-control"
                name="password"
            />
            <div
                v-if="errors.has('password')"
                class="alert alert-danger"
                role="alert"
            >Password is required!</div>
          </div>
          <div class="form-group">
            <button class="btn btn-primary btn-block" :disabled="loading">
              <span v-show="loading" class="spinner-border spinner-border-sm"></span>
              <span>Login</span>
            </button>
          </div>
          <div class="form-group">
            <div v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
