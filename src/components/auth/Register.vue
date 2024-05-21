<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import User from '../../models/user.js';

const user = ref(new User('', '', ''));
const submitted = ref(false);
const successful = ref(false);
const message = ref('');
const store = useStore();
const router = useRouter();

const loggedIn = store.state.auth.status.loggedIn;

const handleRegister = () => {
  message.value = '';
  submitted.value = true;
  store.dispatch('auth/register', user.value).then(
      data => {
        message.value = data.message;
        successful.value = true;
      },
      error => {
        message.value = (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        successful.value = false;
      }
  );
  if (successful.value) {
    router.push('/profile');
  }
};
</script>

<template>
  <div class="col-md-12">
    <div class="card card-container">
      <h3>Register</h3>
      <form name="form" @submit.prevent="handleRegister">
        <div v-if="!successful">
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
            <label for="email">Email</label>
            <input
                v-model="user.email"
                type="email"
                class="form-control"
                name="email"
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
            <button class="btn btn-primary btn-block">Sign Up</button>
          </div>
        </div>
      </form>

      <div
          v-if="message"
          class="alert"
          :class="successful ? 'alert-success' : 'alert-danger'"
      >{{message}}</div>
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
