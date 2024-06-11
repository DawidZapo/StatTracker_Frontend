import Player from "@/models/player/Player.js";

class PlayerWithTeam extends Player{
    constructor(data) {
        super(data);
        this.teamName = data.teamName;
        this.teamId = data.teamId;
    }
}
export default PlayerWithTeam;
