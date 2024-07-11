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
import PlayerStats from "@/components/player_routes/PlayerStats.vue";
import PlayerRecords from "@/components/player_routes/PlayerRecords.vue";
import PlayerInfo from "@/components/player_routes/PlayerInfo.vue";
import EditPlayer from "@/components/EditPlayer.vue";
import GameTeamStats from "@/components/game_routes/GameTeamStats.vue";
import GamePlayerStats from "@/components/game_routes/GamePlayerStats.vue";
import GamePlayByPlay from "@/components/game_routes/GamePlayByPlay.vue";
import GameCreation from "@/components/game_routes/GameCreation.vue";
import GameHandler from "@/components/game_handling/GameHandler.vue";
import Temp from "@/components/game_routes/Temp.vue";
import {jwtDecode} from "jwt-decode";

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
        path: '/game_creation',
        component: GameCreation
    },
    {
        path: '/game_handler',
        component: GameHandler
    },
    {
        path: '/temp',
        component: Temp
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
        component: () => import('./components/main_routes/Players.vue'),
        children: [
            {
                path: 'info',
                component: PlayerInfo
            },
            {
                path: 'stats',
                component: PlayerStats
            },
            {
                path: 'records',
                component: PlayerRecords
            },
            {
                path: 'edit',
                component: EditPlayer
            }
        ]
    },
    {
        path: '/games',
        component: () => import('./components/main_routes/Games.vue'),
        children: [
            {
                path: 'stats',
                component: GameTeamStats
            },
            {
                path: 'player_stats',
                component: GamePlayerStats
            },
            {
                path: 'play_by_play',
                component: GamePlayByPlay
            },
        ]
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// router.beforeEach((to, from, next) => {
//   const publicPages = ['/login', '/register', '/home', '/court'];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = localStorage.getItem('user');
//
//   // trying to access a restricted page + not logged in
//   // redirect to login page
//   if (authRequired && !loggedIn) {
//     next('/login');
//   } else {
//     next();
//   }
// });


router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register', '/home', '/court'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');
    let tokenExpired = false;

    if (loggedIn) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            const decodedToken = jwtDecode(user.accessToken);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
                tokenExpired = true;
                localStorage.removeItem('user');
            }
        }
    }

    if (authRequired && (!loggedIn || tokenExpired)) {
        next('/login');
    } else {
        next();
    }
});

export default router;
