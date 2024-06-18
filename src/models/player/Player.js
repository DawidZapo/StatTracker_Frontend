class Player {
    constructor(data) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.height = data.height;
        this.weight = data.weight;
        this.position = data.position;
        this.birth = data.birth;
        this.startingFive = false;
        this.shirtNumber = 1;
    }
}

export default Player;
