<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import User from '../../models/user.js';

const user = ref(new User('', ''));
const loading = ref(false);
const message = ref('');
const store = useStore();
const router = useRouter();

const loggedIn = store.state.auth.status.loggedIn;

const handleLogin = () => {
  loading.value = true;
  if (user.value.username && user.value.password) {
    store.dispatch('auth/login', user.value).then(
        () => {
          router.push('/profile');
        },
        error => {
          loading.value = false;
          message.value = (error.response && error.response.data && error.response.data.message) ||
              error.message ||
              error.toString();
        }
    );
  } else {
    loading.value = false;
  }
};
</script>

<template>
  <div class="col-md-12">
    <div class="card card-container">
      <h3>Login</h3>
      <form name="form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username</label>
          <input
              v-model="user.username"
              type="text"
              class="form-control"
              name="username"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
              v-model="user.password"
              type="password"
              class="form-control"
              name="password"
          />
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
      </form>
    </div>
  </div>
</template>


<style scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
</style>
