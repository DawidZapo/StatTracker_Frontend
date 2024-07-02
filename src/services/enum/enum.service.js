import axios from "axios";
import authHeader from "@/services/auth/auth-header.js";

const API_URL = 'http://localhost:8080/api/type/';

class EnumService{
    fetchEnumTypes(playOrHandOrContested){
        return axios.get(API_URL + playOrHandOrContested, {headers: authHeader()})
            .then(response => {
                return response.data;
            })
            .catch(error => {
                throw error;
            });
    }
}

export default new EnumService();
