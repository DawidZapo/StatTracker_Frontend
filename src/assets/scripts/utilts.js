export const formatTypeText = (string) => {
    let formattedString = string.replace(/_/g, ' ');
    formattedString = formattedString.toLowerCase();
    formattedString = formattedString.charAt(0).toUpperCase() + formattedString.slice(1);

    return formattedString;
};

export const smoothScrollToBottom = (element) => {
    const scrollHeight = element.scrollHeight;
    const startScrollTop = element.scrollTop;
    const distance = scrollHeight - startScrollTop;
    const duration = 500;
    let startTime = null;

    const animateScroll = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        element.scrollTop = startScrollTop + distance * progress;

        if (timeElapsed < duration) {
            window.requestAnimationFrame(animateScroll);
        } else {
            element.scrollTop = scrollHeight;
        }
    };

    window.requestAnimationFrame(animateScroll);
};


export const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
};

export const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
};

export const addPlayToPlayerAndGame = (game, createdPlay, doesPlayExist) => {
    const replacePlayInList = (list, playId, newPlay) => {
        const index = list.findIndex(play => play.id === playId);
        if (index !== -1) {
            list[index] = newPlay;
        }
    };

    if (doesPlayExist) {
        replacePlayInList(game.plays, createdPlay.id, createdPlay);

        let replaced = false;
        const replacePlayInPlayer = (player, createdPlay) => {
            replacePlayInList(player.plays, createdPlay.id, createdPlay);
            replaced = true;
        };

        if (createdPlay.statPlayerId) {
            for (let i = 0; i < game.home.players.length; i++) {
                const player = game.home.players[i];
                if (player.statPlayerId === createdPlay.statPlayerId) {
                    replacePlayInPlayer(player, createdPlay);
                    break;
                }
            }

            if (!replaced) {
                for (let i = 0; i < game.away.players.length; i++) {
                    const player = game.away.players[i];
                    if (player.statPlayerId === createdPlay.statPlayerId) {
                        replacePlayInPlayer(player, createdPlay);
                        break;
                    }
                }
            }

            if (!replaced) {
                console.error(`Nie znaleziono gracza o statPlayerId: ${createdPlay.statPlayerId} w drużynie.`);
            }
        } else {
            console.error('createdPlay.statPlayerId nie zostało zdefiniowane.');
        }
    } else {
        game.plays.push(createdPlay);

        let added = false;
        const addPlayToPlayer = (player, createdPlay) => {
            player.plays.push(createdPlay);
            added = true;
        };

        if (createdPlay.statPlayerId) {
            for (let i = 0; i < game.home.players.length; i++) {
                const player = game.home.players[i];
                if (player.statPlayerId === createdPlay.statPlayerId) {
                    addPlayToPlayer(player, createdPlay);
                    // updateStats(player.stats, createdPlay);
                    // updateStats(game.home.stats, createdPlay);
                    break;
                }
            }

            if (!added) {
                for (let i = 0; i < game.away.players.length; i++) {
                    const player = game.away.players[i];
                    if (player.statPlayerId === createdPlay.statPlayerId) {
                        addPlayToPlayer(player, createdPlay);
                        // updateStats(player.stats, createdPlay);
                        // updateStats(game.away.stats, createdPlay);
                        break;
                    }
                }
            }

            if (!added) {
                console.error(`Nie znaleziono gracza o statPlayerId: ${createdPlay.statPlayerId} w drużynie.`);
            }
        } else {
            console.error('createdPlay.statPlayerId nie zostało zdefiniowane.');
        }
    }
};


export const findLineUpByStatPlayerId = (player, homeLineup, awayLineup) => {
    const homePlayerIds = homeLineup.map(p => p.statPlayerId);
    const awayPlayerIds = awayLineup.map(p => p.statPlayerId);

    const isInHomeLineup = homePlayerIds.includes(player.statPlayerId);
    const isInAwayLineup = awayPlayerIds.includes(player.statPlayerId);

    if(isInHomeLineup){
        return { scoringLineup : homeLineup, loosingLineup: awayLineup};
    }
    else if(isInAwayLineup){
        return { scoringLineup : awayLineup, loosingLineup: homeLineup};
    }
    else{
        throw new Error('Lineup not found by player.statPlayerId when updating +/-');
    }
};

export const findTeamAndPlayerByPlayStatPlayerId = (game, play) => {
    let player = game.home.players.find(player => player.statPlayerId === play.statPlayerId);
    if (player) {
        return { team: game.home, player: player };
    }

    player = game.away.players.find(player => player.statPlayerId === play.statPlayerId);
    if (player) {
        return { team: game.away, player: player };
    }

    return null;
};

export const updateTeamAndPlayerStats = (teamStats, playerStats, play, scoringLineup, loosingLineup) => {
    switch(play.playType){
        case 'ASSIST':
            updateAssist(teamStats, playerStats);
            break;
        case 'BLOCK':
            updateBlock(teamStats, playerStats);
            break;
        case 'FOUL':
            updateFoul(teamStats, playerStats);
            break;
        case 'REBOUND':
            updateRebound(play, teamStats, playerStats);
            break;
        case 'SHOTPLAY':
            updateShotPlay(play, teamStats, playerStats, scoringLineup, loosingLineup);
            break;
        case 'STEAL':
            updateSteal(teamStats, playerStats);
            break;
        case 'TURNOVER':
            updateTurnover(teamStats, playerStats);
            break;

        default:
            throw new Error('play.type not known');
    }
};

const updateShotPlay = (shotPlay, teamStats, playerStats, scoringLineup, loosingLineup) => {
    if (shotPlay.worth === 1) {
        teamStats.freeThrowAttempted++;
        playerStats.freeThrowAttempted++;
        if (shotPlay.made) {
            teamStats.freeThrowMade++;
            playerStats.freeThrowMade++;

            teamStats.totalPoints++;
            playerStats.totalPoints++;

            updatePlusMinus(scoringLineup, 1);
            updatePlusMinus(loosingLineup, -1);
        }
    } else if (shotPlay.worth === 2) {
        teamStats.twoAttempted++;
        playerStats.twoAttempted++;
        if (shotPlay.made) {
            teamStats.twoMade++;
            playerStats.twoMade++;

            teamStats.totalPoints = teamStats.totalPoints + 2;
            playerStats.totalPoints = playerStats.totalPoints + 2;

            updatePlusMinus(scoringLineup, 2);
            updatePlusMinus(loosingLineup, -2);
        } else {
            if (shotPlay.contested === 'BLOCKED') {
                teamStats.blocksReceived++;
                playerStats.blocksReceived++;
            }
        }
    } else if (shotPlay.worth === 3) {
        teamStats.threeAttempted++;
        playerStats.threeAttempted++;
        if (shotPlay.made) {
            teamStats.threeMade++;
            playerStats.threeMade++;

            teamStats.totalPoints = teamStats.totalPoints + 3;
            playerStats.totalPoints = playerStats.totalPoints + 3;

            updatePlusMinus(scoringLineup, 3);
            updatePlusMinus(loosingLineup, -3);
        } else {
            if (shotPlay.contested === 'BLOCKED') {
                teamStats.blocksReceived++;
                playerStats.blocksReceived++;
            }
        }
    } else {
        throw new Error("Shotplay worth unknown");
    }

};

const updateAssist = (teamStats, playerStats) => {
  teamStats.assists++;
  playerStats.assists++;
};

const updateBlock = (teamStats, playerStats) => {
    teamStats.blocks++;
    playerStats.blocks++;
};

const updateFoul = (teamStats, playerStats) => {
    teamStats.fouls++;
    playerStats.fouls++;
};

const updateRebound = (rebound, teamStats, playerStats) => {
  if(rebound.offensive){
      teamStats.offRebounds++;
      playerStats.offRebounds++;
  }
  else{
      teamStats.defRebounds++;
      playerStats.defRebounds++;
  }
};

const updateSteal = (teamStats, playerStats) => {
    teamStats.steals++;
    playerStats.steals++;
};

const updateTurnover = (teamStats, playerStats) => {
    teamStats.turnovers++;
    playerStats.turnovers++;
};

const updatePlusMinus = (lineup, value) => {
    lineup.forEach(player => {
        player.stats.plusMinus = (player.stats.plusMinus + value);
        console.log(player.lastName);
        console.log(value);
        console.log(player.stats.plusMinus)
    });
};
