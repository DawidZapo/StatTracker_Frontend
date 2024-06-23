import {createStore} from 'vuex';

import { auth } from './moduls/auth.module.js';
import {team} from "@/store/moduls/team.module.js";
import {player} from "@/store/moduls/player.module.js";
import {game} from "@/store/moduls/game.module.js";
import {homeTeam} from "@/store/moduls/hometeam.module.js";
import {awayTeam} from "@/store/moduls/awayteam.module.js";

export default createStore({
    modules: {
        auth,
        team,
        player,
        game,
        homeTeam,
        awayTeam

    }
})
