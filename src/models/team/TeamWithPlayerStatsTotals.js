import PlayerWithStatsTotals from "@/models/player/PlayerWithStatsTotals.js";

class TeamWithPlayerStatsTotals{
    constructor(data) {
        this.players = data.map(player => new PlayerWithStatsTotals(player));
    }
}

export default TeamWithPlayerStatsTotals;
