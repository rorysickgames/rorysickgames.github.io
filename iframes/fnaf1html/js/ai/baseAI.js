export class BaseAI {
    constructor(name, aiLevel, path) {
        this.name = name;
        this.aiLevel = aiLevel;
        this.path = path;
        this.currentLocationIndex = 0;
    }

    moveCheck() {
        const roll = Math.floor(Math.random() * 20) + 1;
        if (roll <= this.aiLevel) {
            this.move();
        }
    }

    move() {
        if (this.currentLocationIndex < this.path.length - 1) {
            this.currentLocationIndex++;
        }
    }
}
