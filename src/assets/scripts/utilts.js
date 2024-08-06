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
                    break;
                }
            }

            if (!added) {
                for (let i = 0; i < game.away.players.length; i++) {
                    const player = game.away.players[i];
                    if (player.statPlayerId === createdPlay.statPlayerId) {
                        addPlayToPlayer(player, createdPlay);
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
