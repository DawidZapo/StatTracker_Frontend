import authHeader from "@/services/auth/auth-header.js";
import axios from "axios";
import Team from "@/models/Team.js";

const API_URL = 'http://localhost:8080/api/team/';

class TeamService{
    getTeam(id){
        return axios.get(API_URL + id, {headers: authHeader()})
            .then(response =>{
                return new Team(response.data);
            });
    }
}

export default new TeamService();
