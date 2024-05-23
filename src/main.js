import { createApp } from 'vue'
import App from './App.vue';
import router from './router';
import store from './store';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
const app = createApp(App);

app.config.productionTip = false;
app.use(router);
app.use(store);

app.mount('#app');
