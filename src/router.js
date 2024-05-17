import {createRouter, createWebHistory} from 'vue-router';
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import BasketballCourt from "@/components/BasketballCourt.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/home',
        component: Home
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/register',
        component: Register
    },
    {
        path: '/court',
        component: BasketballCourt
    },
    {
        path: '/profile',
        name: 'profile',
        // lazy-loaded
        component: () => import('./components/Profile.vue')
    },
    {
        path: '/admin',
        name: 'admin',
        // lazy-loaded
        component: () => import('./components/BoardAdmin.vue')
    },
    {
        path: '/mod',
        name: 'moderator',
        // lazy-loaded
        component: () => import('./components/BoardModerator.vue')
    },
    {
        path: '/user',
        name: 'user',
        // lazy-loaded
        component: () => import('./components/BoardUser.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/home', '/court'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
