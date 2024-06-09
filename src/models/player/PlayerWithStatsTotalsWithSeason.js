import { createStatsComputed } from '@/assets/scripts/stats';
import { reactive } from 'vue';
import PlayerWithStatsTotals from './PlayerWithStatsTotals';

class PlayerWithStatsTotalsWithSeason extends PlayerWithStatsTotals {
    constructor({
                    id,
                    fullName,
                    numberOfGames,
                    timeOnCourtInMs,
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
                    possessions,
                    season,
                    teamName
                }) {
        super({
            id,
            fullName,
            numberOfGames,
            timeOnCourtInMs,
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
        });

        this.season = season;
        this.teamName = teamName;

        const reactiveEntity = reactive(this);
        this.stats = createStatsComputed(reactiveEntity);
    }
}

export default PlayerWithStatsTotalsWithSeason;
