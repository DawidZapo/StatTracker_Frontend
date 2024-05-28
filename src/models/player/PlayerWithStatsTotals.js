class PlayerWithStatsTotals {
    constructor({
                    id,
                    fullName,
                    numberOfGames,
                    timeOnCourt,
                    startingFive,
                    totalPoints,
                    twoPointShotsAttempted,
                    twoPointShotsMade,
                    threePointShotsAttempted,
                    threePointShotsMade,
                    freeThrowsAttempted,
                    freeThrowsMade,
                    offRebounds,
                    defRebounds,
                    assists,
                    fouls,
                    forcedFouls,
                    turnOvers,
                    steals,
                    blocks,
                    blocksReceived,
                    evaluation,
                    possessions
                }) {
        this.id = id;
        this.fullName = fullName;
        this.numberOfGames = numberOfGames;
        this.timeOnCourt = timeOnCourt;
        this.startingFive = startingFive;
        this.totalPoints = totalPoints;
        this.twoPointShotsAttempted = twoPointShotsAttempted;
        this.twoPointShotsMade = twoPointShotsMade;
        this.threePointShotsAttempted = threePointShotsAttempted;
        this.threePointShotsMade = threePointShotsMade;
        this.freeThrowsAttempted = freeThrowsAttempted;
        this.freeThrowsMade = freeThrowsMade;
        this.offRebounds = offRebounds;
        this.defRebounds = defRebounds;
        this.assists = assists;
        this.fouls = fouls;
        this.forcedFouls = forcedFouls;
        this.turnOvers = turnOvers;
        this.steals = steals;
        this.blocks = blocks;
        this.blocksReceived = blocksReceived;
        this.evaluation = evaluation;
        this.possessions = possessions;
        this.timeOnCourtInMin = this.formatTimeOnCourt();
    }

    formatTimeOnCourt() {
        const minutes = Math.floor(this.timeOnCourt / 60000);
        const seconds = ((this.timeOnCourt % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}

export default PlayerWithStatsTotals;
