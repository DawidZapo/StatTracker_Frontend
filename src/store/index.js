import {createStore} from 'vuex';

import { auth } from './auth.module';
import {team} from "@/store/team.module.js";
import {player} from "@/store/player.module.js";
import {game} from "@/store/game.module.js";
import {homeTeam} from "@/store/hometeam.module.js";
import {awayTeam} from "@/store/awayteam.module.js";

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
