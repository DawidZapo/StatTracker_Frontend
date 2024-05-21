import {createStore} from 'vuex';

import { auth } from './auth.module';
import {team} from "@/store/team.module.js";

export default createStore({
    modules: {
        auth,
        team
    }
})
