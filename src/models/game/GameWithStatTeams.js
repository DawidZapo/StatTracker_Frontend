import {createPercentageComputed} from "@/assets/scripts/stats.js";

class StatLine {
    constructor({
                    timeOnCourtInMs,
                    twoAttempted,
                    twoMade,
                    threeAttempted,
                    threeMade,
                    freeThrowAttempted,
                    freeThrowMade,
                    totalPoints,
                    offRebounds,
                    defRebounds,
                    assists,
                    fouls,
                    forcedFouls,
                    turnovers,
                    steals,
                    blocks,
                    blocksReceived,
                    evaluation,
                    plusMinus,
                    possessions
                }) {
        this.timeOnCourtInMs = timeOnCourtInMs;
        this.twoAttempted = twoAttempted;
        this.twoMade = twoMade;
        this.threeAttempted = threeAttempted;
        this.threeMade = threeMade;
        this.freeThrowAttempted = freeThrowAttempted;
        this.freeThrowMade = freeThrowMade;
        this.totalPoints = totalPoints;
        this.offRebounds = offRebounds;
        this.defRebounds = defRebounds;
        this.assists = assists;
        this.fouls = fouls;
        this.forcedFouls = forcedFouls;
        this.turnovers = turnovers;
        this.steals = steals;
        this.blocks = blocks;
        this.blocksReceived = blocksReceived;
        this.evaluation = evaluation;
        this.plusMinus = plusMinus;
        this.possessions = possessions;
    }
}

class Player {
    constructor({ id, firstName, lastName, shirtNumber, startingFive, statLine }) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.shirtNumber = shirtNumber;
        this.startingFive = startingFive;
        this.statLine = new StatLine(statLine);
        this.percentage = createPercentageComputed(statLine);
    }
}

class Team {
    constructor({ id, name, location, address, arena, scores, statLine, players }) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.address = address;
        this.arena = arena;
        this.scores = scores;
        this.statLine = new StatLine(statLine);
        this.percentage = createPercentageComputed(statLine);
        this.players = players.map(player => new Player(player));
    }
}

class GameWithStatTeams {
    constructor({ id, date, time, season, home, away, official }) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.season = season;
        this.home = new Team(home);
        this.away = new Team(away);
        this.official = official;
    }
}

export default GameWithStatTeams;

