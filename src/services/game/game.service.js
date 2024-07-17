import axios from "axios";
import authHeader from "@/services/auth/auth-header.js";
import GameWithTeamNames from "@/models/game/GameWithTeamNames.js";
import GameWIthStatTeams from "@/models/game/GameWithStatTeams.js";
import GameWithStatTeams from "@/models/game/GameWithStatTeams.js";
import GameToHandle from "@/models/game/GameToHandle.js";

const API_URL = 'http://localhost:8080/api/game/';

class GameService{
    fetchAllGamesWithTeamNames(){
        return axios.get(API_URL + 'all', {headers: authHeader()})
            .then(response =>{
                return response.data.map(teamData => new GameWithTeamNames(teamData));
            })
            .catch(error => {
                console.error("Error while fetching games: " + error);
                throw error;
            });
    }

    fetchGameWithStatTeams(id){
        return axios.get(API_URL + 'stat_teams/' + id, {headers: authHeader()})
            .then(response => {
                return new GameWithStatTeams(response.data);
            })
            .catch(error => {
                console.error("Error while fetching game with stat teams: " + error);
                throw error;
            })
    }

    createGame(gameCreated){
        return axios.post(API_URL + 'create', gameCreated, {headers: authHeader()})
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Error while creating game: " + error);
                throw error;
            });
    }

    fetchGameToHandle(id){
        return axios.get(API_URL + 'to_handle/' + id, {headers: authHeader()})
            .then(response => {
                return new GameToHandle(response.data);
            })
            .catch(error => {
                console.error("Error while fetching game to handle: " + error);
                throw error;
            });
    }

    saveGameToHandle(gameToHandle){
        return axios.post(API_URL + 'save', gameToHandle, {headers: authHeader()})
            .then(response => {
                return new GameToHandle(response.data);
            })
            .catch(error => {
                console.error('Error while saving gameToHandle: ' + error);
                throw error;
            });
    }

}
export default new GameService();
