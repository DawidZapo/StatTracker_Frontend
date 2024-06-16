import {createPercentageComputed} from "@/assets/scripts/stats.js";

class StatLine {
    constructor(data) {
        this.timeOnCourtInMs = data.timeOnCourtInMs;
        this.twoAttempted = data.twoAttempted;
        this.twoMade = data.twoMade;
        this.threeAttempted = data.threeAttempted;
        this.threeMade = data.threeMade;
        this.freeThrowAttempted = data.freeThrowAttempted;
        this.freeThrowMade = data.freeThrowMade;
        this.totalPoints = data.totalPoints;
        this.offRebounds = data.offRebounds;
        this.defRebounds = data.defRebounds;
        this.assists = data.assists;
        this.fouls = data.fouls;
        this.forcedFouls = data.forcedFouls;
        this.turnovers = data.turnovers;
        this.steals = data.steals;
        this.blocks = data.blocks;
        this.blocksReceived = data.blocksReceived;
        this.evaluation = data.evaluation;
        this.plusMinus = data.plusMinus;
        this.possessions = data.possessions;
        this.percentage = createPercentageComputed(data);
    }
}

class Player {
    constructor(data) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.shirtNumber = data.shirtNumber;
        this.startingFive = data.startingFive;
        this.statLine = new StatLine(data.statLine);
    }
}

class Team {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.location = data.location;
        this.address = data.address;
        this.arena = data.arena;
        this.scores = data.scores;
        this.statLine = new StatLine(data.statLine);
        this.percentage = createPercentageComputed(data.statLine);
        this.players = data.players.map(player => new Player(player));
    }
}

class GameWithStatTeams {
    constructor(data) {
        this.id = data.id;
        this.date = data.date;
        this.time = data.time;
        this.season = data.season;
        this.home = new Team(data.home);
        this.away = new Team(data.away);
        this.official = data.official;
    }
}

export default GameWithStatTeams;

