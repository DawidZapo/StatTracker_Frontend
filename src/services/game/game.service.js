import axios from "axios";
import authHeader from "@/services/auth/auth-header.js";
import GameWithTeamNames from "@/models/game/GameWithTeamNames.js";
import GameWIthStatTeams from "@/models/game/GameWithStatTeams.js";
import GameWithStatTeams from "@/models/game/GameWithStatTeams.js";

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
}
export default new GameService();
