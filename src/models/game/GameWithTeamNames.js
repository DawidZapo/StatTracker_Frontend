class GameWithTeamNames{
    constructor(data) {
        this.id = data.id;
        this.home = data.home;
        this.away = data.away;
        this.date = data.date;
        this.time = data.time;
        this.season = data.season;
        this.official = data.official;
    }
}

export default GameWithTeamNames;
