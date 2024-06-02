import {createStore} from 'vuex';

import { auth } from './auth.module';
import {team} from "@/store/team.module.js";
import {player} from "@/store/player.module.js";

export default createStore({
    modules: {
        auth,
        team,
        player
    }
})
