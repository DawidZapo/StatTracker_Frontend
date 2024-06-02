import Player from "@/models/player/Player.js";

class PlayerWithTeam extends Player{
    constructor(data) {
        super(data);
        this.teamName = data.teamName;
    }
}
export default PlayerWithTeam;
