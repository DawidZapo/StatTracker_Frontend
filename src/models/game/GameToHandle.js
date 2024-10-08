import {createPercentageComputed} from "@/assets/scripts/stats.js";

function createPlay(playData) {
    switch (playData.playType) {
        case "ASSIST":
            return new Assist(playData);
        case "BLOCK":
            return new Block(playData);
        case "FOUL":
            return new Foul(playData);
        case "SHOTPLAY":
            return new ShotPlay(playData);
        case "TURNOVER":
            return new Turnover(playData);
        case "STEAL":
            return new Steal(playData);
        case "REBOUND":
            return new Rebound(playData);
        case "VIOLATION":
            return new Violation(playData);
        default:
            throw new Error(`Unknown play type: ${playData.playType}`);
    }
}

function formatMsToHH_MM_SS(ms) {
    let minutes = Math.floor(ms / 60000);
    ms %= 60000;
    let seconds = Math.floor(ms / 1000);
    let milliseconds = Math.floor((ms % 1000) / 10);

    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');
    milliseconds = String(milliseconds).padStart(2, '0');

    return `${minutes}:${seconds}:${milliseconds}`;
}

export class Play {
    constructor(data) {
        if (this.constructor === Play) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.id = data.id;
        this.gameId = data.gameId;
        this.statPlayerId = data.statPlayerId;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.timeRemaining = data.timeRemaining;
        this.quarter = data.quarter;
        this.order = data.order;
        this.comments = data.comments;
        this.playType = data.playType;
        this.hand = data.hand;
        this.formattedTime = formatMsToHH_MM_SS(data.timeRemaining);
    }
    describe() {
        throw new Error("Abstract method 'describe' must be implemented.");
    }
}

export class Assist extends Play {
    constructor(data) {
        super(data);
        this.toStatPlayerId = data.toStatPlayerId;
        this.type = data.type;
    }

    describe() {
        return this.type + ' ASSIST';
    }
}

export class Block extends Play {
    constructor(data) {
        super(data);
        this.blockedStatPlayerId = data.blockedStatPlayerId;
        this.inThePaint = data.inThePaint;
    }

    describe() {
        return 'BLOCK';
    }
}

export class Foul extends Play {
    constructor(data) {
        super(data);
        this.foulOnStatPlayerId = data.foulOnStatPlayerId;
        this.type = data.type;
    }

    describe() {
        return this.type + ' FOUL';
    }
}
export class Rebound extends Play {
    constructor(data) {
        super(data);
        this.offensive = data.offensive;
    }

    describe() {
        return (this.offensive ? ' OFFENSIVE' : 'DEFENSIVE') + ' REBOUND';
    }
}
export class ShotPlay extends Play {
    constructor(data) {
        super(data);
        this.type = data.type;
        this.zone = data.zone;
        this.made = data.made;
        this.contested = data.contested;
        this.worth = data.worth;
        this.offTheDribble = data.offTheDribble;
    }

    describe() {
        let madeOrMissed = this.made ? 'MADE' : 'MISSED';
        // if(this.worth === 1){
        //     return 'FREE_THROW ' + madeOrMissed;
        // }
        // else if(this.worth === 2){
        //     return this.type + '2PT' + madeOrMissed;
        // }
        // else if(this.worth === 3){
        //     return this.type + '3PT' + madeOrMissed;
        // }
        // else{
        //     throw new Error('In function describe: worth not matching to 1PT, 2PT, 3PT');
        // }
    }
}

export class Steal extends Play {
    constructor(data) {
        super(data);
        this.turnoverForStatPlayerId = data.turnoverForStatPlayerId;
    }

    describe() {
        return 'STEAL';
    }
}

export class Turnover extends Play {
    constructor(data) {
        super(data);
        this.stealForStatPlayerId = data.stealForStatPlayerId;
        this.type = data.type;
    }

    describe() {
        return this.type + ' TURNOVER';
    }
}

export class Violation extends Play {
    constructor(data) {
        super(data);
        this.type = data.type;
    }

    describe() {
        return this.type + ' VIOLATION';
    }
}
class Score {
    constructor(data) {
        this.id = data.id;
        this.statTeamId = data.id;
        this.worth = data.worth;
        this.part = data.part;
    }
}
class Stats {
    constructor(data) {
        this.id = data.id;
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
        this.playerId = data.playerId;
        this.statPlayerId = data.statPlayerId;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.shirtNumber = data.shirtNumber;
        this.startingFive = data.startingFive;
        this.onCourt = data.onCourt;
        this.positionOnCourt = data.positionOnCourt;
        this.stats = new Stats(data.stats);
        this.plays = data.plays.map(playData => createPlay(playData));
        this.dominantHand = data.dominantHand;
    }
}

class Team {
    constructor(data) {
        this.teamId = data.teamId;
        this.statTeamId = data.statTeamId;
        this.name = data.name;
        this.players = data.players.map(playerData => new Player(playerData));
        this.scores = data.scores.map(scoreData => new Score(scoreData));
        this.stats = new Stats(data.stats);
    }
}

class GameToHandle {
    constructor(data) {
        this.id = data.id;
        this.localDateTime = data.localDateTime;
        this.season = data.season;
        this.official = data.official;
        this.quarterLengthMin = data.quarterLengthMin;
        this.overtimeLengthMin = data.overtimeLengthMin;
        this.currentQuarterTimeRemainingMs = data.currentQuarterTimeRemainingMs;
        this.currentQuarter = data.currentQuarter;
        this.home = new Team(data.home);
        this.away = new Team(data.away);
        this.plays = data.plays.map(playData => createPlay(playData));
    }
}

export default GameToHandle;
