import {computed} from "vue";

const calculatePercentage = (made, attempted) => {
    return attempted > 0 ? (made / attempted) * 100 : 0;
};

const calculateAverage = (total, games) => {
    return games > 0 ? total / games : 0;
};

export const createStatsComputed = (entity) => {
    return {
        fieldGoalsAttempted: computed(() => entity.twoPointShotsAttempted + entity.threePointShotsAttempted),
        fieldGoalsMade: computed(() => entity.twoPointShotsMade + entity.threePointShotsMade),
        twoPointPercentage: computed(() => parseFloat(calculatePercentage(entity.twoPointShotsMade, entity.twoPointShotsAttempted).toFixed(2))),
        threePointPercentage: computed(() => parseFloat(calculatePercentage(entity.threePointShotsMade, entity.threePointShotsAttempted).toFixed(2))),
        fieldGoalPercentage: computed(() => parseFloat(calculatePercentage(entity.twoPointShotsMade + entity.threePointShotsMade, entity.twoPointShotsAttempted + entity.threePointShotsAttempted).toFixed(2))),
        freeThrowPercentage: computed(() => parseFloat(calculatePercentage(entity.freeThrowsMade, entity.freeThrowsAttempted).toFixed(2))),
        averagePoints: computed(() => calculateAverage(entity.totalPoints, entity.numberOfGames)),
        averageOffRebounds: computed(() => calculateAverage(entity.offRebounds, entity.numberOfGames)),
        averageDefRebounds: computed(() => calculateAverage(entity.defRebounds, entity.numberOfGames)),
        averageAssists: computed(() => calculateAverage(entity.assists, entity.numberOfGames)),
        averageFouls: computed(() => calculateAverage(entity.fouls, entity.numberOfGames)),
        averageForcedFouls: computed(() => calculateAverage(entity.forcedFouls, entity.numberOfGames)),
        averageTurnovers: computed(() => calculateAverage(entity.turnOvers, entity.numberOfGames)),
        averageSteals: computed(() => calculateAverage(entity.steals, entity.numberOfGames)),
        averageBlocks: computed(() => calculateAverage(entity.blocks, entity.numberOfGames)),
        averageBlocksReceived: computed(() => calculateAverage(entity.blocksReceived, entity.numberOfGames)),
        averagePossessions: computed(() => calculateAverage(entity.possessions, entity.numberOfGames)),
        averageEval: computed(() => calculateAverage(entity.evaluation, entity.numberOfGames)),
        averageTimeOnCourt: computed( () => calculateAverage(entity.timeOnCourt, entity.numberOfGames))
    };
};
