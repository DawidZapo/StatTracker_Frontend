import axios from "axios";
import authHeader from "@/services/auth/auth-header.js";
import PlayerWithTeam from "@/models/player/PlayerWithTeam.js";
import {Record} from "@/models/team/Record.js";

const API_URL = 'http://localhost:8080/api/player/';

class PlayerService{
    removePlayerFromTeam(player){
        return axios.post(API_URL + 'remove_team', player, {headers: authHeader()})
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Error while removing player from team: ", error);
                throw error;
            });
    }

    fetchAllPlayerWithTeam(){
        return axios.get(API_URL + 'all', {headers: authHeader()})
            .then(response => {
                return response.data.map(playerData => new PlayerWithTeam(playerData));
            })
            .catch(error => {
               console.error("Error while fetching players with team: ", error);
               throw error;
            });
    }

    fetchPlayerWithTeam(id){
        return axios.get(API_URL + id, {headers: authHeader()})
            .then(response => {
                return new PlayerWithTeam(response.data);
            })
            .catch(error => {
               console.error("Error while fetching player: ", error);
               throw error;
            });
    }

    fetchPlayerRecords(id, season){
        return axios.get(API_URL + 'records/' + id + '/' + season, {headers: authHeader()})
            .then(response => {
                return response.data.map(recordData => new Record(
                    recordData.order,
                    recordData.name,
                    recordData.playerFullName,
                    recordData.value,
                    recordData.date,
                    recordData.opponent,
                    recordData.score
                ));
            })
            .catch(error => {
                console.error("Error while fetching player records: " + error);
                throw error;
            });
    }


}

export default new PlayerService();
