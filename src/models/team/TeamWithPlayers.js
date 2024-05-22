import Player from '../player/Player.js';

class TeamWithPlayers {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.location = data.location;
        this.arena = data.arena;
        this.address = data.address;
        this.currentPlayers = data.currentPlayers.map(player => new Player(player));
    }
}

export default TeamWithPlayers;
