import {createRouter, createWebHistory} from 'vue-router';
import Home from './components/main_routes/Home.vue';
import Login from './components/auth/Login.vue';
import Register from './components/auth/Register.vue';
import BasketballCourt from "@/components/BasketballCourt.vue";
import Teams from "@/components/main_routes/Teams.vue";
import Info from "@/components/team_routes/TeamInfo.vue";
import TeamStats from "@/components/team_routes/TeamStats.vue";
import TeamPlayersStats from "@/components/team_routes/TeamPlayersStats.vue";
import TeamPlayersRecords from "@/components/team_routes/TeamPlayersRecords.vue";
import TeamRecords from "@/components/team_routes/TeamRecords.vue";
import AddTeam from "@/components/AddTeam.vue";
import EditTeam from "@/components/EditTeam.vue";

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
        component: () => import('./components/main_routes/Profile.vue')
    },
    {
        path: '/teams',
        component: () => import('./components/main_routes/Teams.vue'),
        children: [
            {
                path: 'info',
                component: Info
            },
            {
                path: 'stats',
                component: TeamStats
            },
            {
              path: 'records',
              component: TeamRecords
            },
            {
                path: 'players_stats',
                component: TeamPlayersStats
            },
            {
                path: 'players_records',
                component: TeamPlayersRecords
            },
            {
                path: 'add',
                component: AddTeam
            },
            {
                path: 'edit',
                component: EditTeam
            }
        ]
    },
    {
        path: '/players',
        component: () => import('./components/main_routes/Players.vue')
    },
    {
        path: '/matches',
        component: () => import('./components/main_routes/Matches.vue')
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
