import authHeader from "@/services/auth/auth-header.js";
import axios from "axios";
import TeamWithPlayers from "@/models/team/TeamWithPlayers.js";
import Team from "@/models/team/Team.js";
import TeamWithStatTotals from "@/models/team/TeamWithStatTotals.js";

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
            })
    }


    fetchTeamWithStatTotals(id){
        return axios.get(API_URL +'totals/' + id, {headers: authHeader()})
            .then(response => {
                return new TeamWithStatTotals(response.data);
            })
    }

}

export default new TeamService();