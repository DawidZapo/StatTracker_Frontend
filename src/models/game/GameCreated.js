class Player {
    constructor(data) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.shirtNumber = data.shirtNumber;
        this.startingFive = data.startingFive;
    }
}

class Team {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.players = data.players.map(dataPlayer => new Player(dataPlayer));
    }
}

class GameCreated {
    constructor(data) {
        this.id = data.id;
        this.date = data.date;
        this.time = data.time;
        this.season = data.season;
        this.official = data.official;
        this.quarterLengthMin = data.quarterLengthMin;
        this.overtimeLengthMin = data.overtimeLengthMin;
        this.home = new Team(data.home);
        this.away = new Team(data.away);
    }
}

export default GameCreated;
