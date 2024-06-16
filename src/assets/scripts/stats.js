import {computed} from "vue";

const calculatePercentage = (made, attempted) => {
    return attempted > 0 ? (made / attempted) * 100 : 0;
};

const calculateAverage = (total, games) => {
    return parseFloat((games > 0 ? total / games : 0).toFixed(2));
};

const formatTimeOnCourt = (timeOnCourtInMs) => {
    const minutes = Math.floor(timeOnCourtInMs / 60000);
    const seconds = ((timeOnCourtInMs % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export const createPercentageComputed = (statLine) =>{
    return {
        twoPoint: computed(() => parseFloat(calculatePercentage(statLine.twoMade, statLine.twoAttempted).toFixed(2))),
        threePoint: computed(() => parseFloat(calculatePercentage(statLine.threeMade, statLine.threeAttempted).toFixed(2))),
        freeThrow: computed(() => parseFloat(calculatePercentage(statLine.freeThrowMade, statLine.freeThrowAttempted).toFixed(2))),
        fieldGoal: computed(()=> parseFloat(calculatePercentage(statLine.twoMade + statLine.threeMade, statLine.twoAttempted + statLine.threeAttempted).toFixed(2)))
    };
}

export const createStatsComputed = (entity, includeTimeOnCourt = true) => {
    const stats = {
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
    };

    if (includeTimeOnCourt) {
        stats.averageTimeOnCourtInMin = computed(() => formatTimeOnCourt(calculateAverage(entity.timeOnCourtInMs, entity.numberOfGames)));
    }

    return stats;
};
