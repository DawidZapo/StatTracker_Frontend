import axios from "axios";
import authHeader from "@/services/auth/auth-header.js";

const API_URL = 'http://localhost:8080/api/play/'

class PlayService{
    saveShotPlay(shotPlay){
        return axios.post(API_URL + 'save/shot_play', shotPlay, {headers: authHeader()})
            .then(response => {
                return response.data;
            })
            .catch(error => {
                throw error;
            });
    }
}
export default new PlayService();
