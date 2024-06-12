import axios from "axios";
import authHeader from "@/services/auth/auth-header.js";
import GameWithTeamNames from "@/models/game/GameWithTeamNames.js";

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
}
export default new GameService();
