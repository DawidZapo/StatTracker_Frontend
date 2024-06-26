import {reactive} from "vue";
import {createStatsComputed} from "@/assets/scripts/stats.js";

class TeamWithStatsTotals {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.numberOfGames = data.numberOfGames;
        this.totalPoints = data.totalPoints;
        this.twoPointShotsAttempted = data.twoPointShotsAttempted;
        this.twoPointShotsMade = data.twoPointShotsMade;
        this.threePointShotsAttempted = data.threePointShotsAttempted;
        this.threePointShotsMade = data.threePointShotsMade;
        this.freeThrowsAttempted = data.freeThrowsAttempted;
        this.freeThrowsMade = data.freeThrowsMade;
        this.offRebounds = data.offRebounds;
        this.defRebounds = data.defRebounds;
        this.assists = data.assists;
        this.fouls = data.fouls;
        this.forcedFouls = data.forcedFouls;
        this.turnOvers = data.turnOvers;
        this.steals = data.steals;
        this.blocks = data.blocks;
        this.blocksReceived = data.blocksReceived;
        this.evaluation = data.evaluation;
        this.possessions = data.possessions;

        const reactiveEntity = reactive(this);
        this.stats = createStatsComputed(reactiveEntity, false);
    }
}

export default TeamWithStatsTotals;
