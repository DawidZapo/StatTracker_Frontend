import axios from "axios";
import authHeader from "@/services/auth/auth-header.js";

const API_URL = 'http://localhost:8080/api/play/'

class PlayService{
    savePlay(playType, playData){
        return axios.post(API_URL + 'save/' + playType, playData, {headers: authHeader()})
            .then(response => {
                return response.data;
            })
            .catch(error => {
                throw error;
            });
    }
}
export default new PlayService();
