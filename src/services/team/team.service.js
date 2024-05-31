import authHeader from "@/services/auth/auth-header.js";
import axios from "axios";
import TeamWithPlayers from "@/models/team/TeamWithPlayers.js";
import Team from "@/models/team/Team.js";
import TeamWithStatTotals from "@/models/team/TeamWithStatsTotals.js";
import TeamWithStatsTotals from "@/models/team/TeamWithStatsTotals.js";
import {TeamWithRecords} from "@/models/team/TeamWithRecords.js";
import {Record} from "@/models/team/Record.js";
import TeamWithPlayerStatsTotals from "@/models/team/TeamWithPlayerStatsTotals.js";

const API_URL = 'http://localhost:8080/api/team/';

class TeamService{
    fetchTeam(id){
        return axios.get(API_URL + id, {headers: authHeader()})
            .then(response =>{
                return new TeamWithPlayers(response.data);
            });
    }

    fetchAllTeam(){
        return axios.get(API_URL + 'all', {headers: authHeader()})
            .then(response => {
                return response.data.map(teamData => new Team(teamData));
            });
    }

    fetchTeamWithStatsTotals(id, opponent = false){
        const endpoint = opponent ? 'opponent_totals/' : 'totals/';
        return axios.get(API_URL + endpoint + id, {headers: authHeader()})
            .then(response => {
                return new TeamWithStatsTotals(response.data);
            });
    }

    fetchTeamWithRecords(id, player = false) {
        const endpoint = player ? 'player_records/' : 'records/'
        return axios.get(API_URL + endpoint + id, { headers: authHeader() })
            .then(response => {
                const records = response.data.records || {};
                const recordsArray = Object.entries(records).map(([key, value]) => {
                    return new Record(value.order, value.name, value.playerFullName, value.value, value.date, value.opponent, value.score);
                });
                return new TeamWithRecords(recordsArray);
            });
    }

    fetchTeamWithPlayerStatsTotals(id){
        return axios.get(API_URL + 'player_totals/' + id, {headers: authHeader()})
            .then(response => {
                return new TeamWithPlayerStatsTotals(response.data.players);
            });
    }



}

export default new TeamService();
