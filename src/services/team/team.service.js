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
    fetchTeamWithPlayers(id){
        return axios.get(API_URL + id, {headers: authHeader()})
            .then(response =>{
                return new TeamWithPlayers(response.data);
            })
            .catch(error => {
                console.error("Error while fetching team with players: " + error);
                throw error
            });
    }

    fetchAllTeam(){
        return axios.get(API_URL + 'all', {headers: authHeader()})
            .then(response => {
                return response.data.map(teamData => new Team(teamData));
            })
            .catch(error => {
                console.error("Error while fetching teams: " + error);
                throw error
            });
    }

    fetchTeamWithStatsTotals(id, season){
        return axios.get(API_URL + 'totals/' + id + '/' + season, {headers: authHeader()})
            .then(response => {
                return new TeamWithStatsTotals(response.data);
            })
            .catch(error => {
                console.error("Error while fetching team with stats totals: " + error);
                throw error
            });
    }

    fetchOpponentWithStatsTotals(id, season){
        return axios.get(API_URL + 'opponent_totals/' + id + '/' + season, {headers: authHeader()})
            .then(response => {
                return new TeamWithStatsTotals(response.data);
            })
            .catch(error => {
                console.error("Error while fetching team with stats totals: " + error);
                throw error
            });
    }

    fetchTeamWithRecords(id, season) {
        return axios.get(API_URL + 'records/' + id + '/' + season, { headers: authHeader() })
            .then(response => {
                const records = response.data.records || {};
                const recordsArray = Object.entries(records).map(([key, value]) => {
                    return new Record(value.order, value.name, value.playerFullName, value.value, value.date, value.opponent, value.score);
                });
                return new TeamWithRecords(recordsArray);
            })
            .catch(error => {
                console.error("Error while fetching team with records: " + error);
                throw error
            });

    }
    fetchTeamPlayerWithRecords(id) {
        return axios.get(API_URL + 'player_records/' + id, { headers: authHeader() })
            .then(response => {
                const records = response.data.records || {};
                const recordsArray = Object.entries(records).map(([key, value]) => {
                    return new Record(value.order, value.name, value.playerFullName, value.value, value.date, value.opponent, value.score);
                });
                return new TeamWithRecords(recordsArray);
            })
            .catch(error => {
                console.error("Error while fetching team with records: " + error);
                throw error
            });

    }

    fetchTeamWithPlayerStatsTotals(id, season){
        return axios.get(API_URL + 'player_totals/' + id + '/' + season, {headers: authHeader()})
            .then(response => {
                return new TeamWithPlayerStatsTotals(response.data.players);
            })
            .catch(error => {
                console.error("Error while fetching team with players' stats totals: " + error);
                throw error
            });
    }

    saveTeamWithPlayersDto(teamWithPlayers){
        return axios.post(API_URL + 'save', teamWithPlayers, {headers: authHeader()})
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Error while saving team: " + error);
                throw error
            });
    }

    fetchPossibleSeasonsFromTeam(id){
        return axios.get(API_URL + 'seasons/' + id, {headers:authHeader()})
            .then(response => {
                return response.data;
            })
            .catch(error => {
               console.error("Error while fetching seasons");
               throw error;
            });
    }


}

export default new TeamService();
