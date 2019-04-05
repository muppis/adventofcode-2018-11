class FuelCell {
    public x: number;
    public y: number;
    public PowerLevel: number;

    constructor(x: number, y: number, gridSerial: number) {
        this.x = x;
        this.y = y;

        let rackID = x + 10;

        let PowerLevel = rackID * y;
        PowerLevel += gridSerial;
        PowerLevel *= rackID;

        if (PowerLevel < 100) {
            PowerLevel = 0;
        }

        PowerLevel = Math.floor((PowerLevel / 100) % 10);

        PowerLevel -= 5;

        this.PowerLevel = PowerLevel;
    }
}

class Grid {
    protected grid: Map<number, FuelCell> = new Map<number, FuelCell>();

    constructor(public width: number, public height: number, public serial: number) {
        for(let y = 1; y <= height; y++) {
            for(let x = 1; x <= width; x++) {
                let fuelcell = new FuelCell(x, y, serial);
                let k = y * this.width + x;

                this.grid.set(k, fuelcell);
            }
        }
    }

    get(x: number, y:number): FuelCell {
        let k = y * this.width + x;
        let fuelcell = this.grid.get(k);

        if (fuelcell == undefined) {
            throw new Error();
        }

        return fuelcell;
    }

    public getSquares(size: number): Square[] {
        let maxX: number = Math.min(this.width, this.width - size + 1);
        let maxY: number = Math.min(this.height - size + 1);

        let x: number;
        let y: number;

        let squares: Square[] = [];

        for (y = 1; y <= maxY; y++) {
            for (x = 1; x <= maxX; x++) {
                squares.push(new Square(x, y, size, this));
            }
        }

        return squares;
    }

    public getLotsOfSquares(): Square[] {
        let squares : Square[] = [];
        let gridSize: number = 40; //Math.min(this.width, this.height);

        for(let size = 1; size <= gridSize; size++) {
            squares = squares.concat(this.getSquares(size));
        }

        return squares;
    }
}

class Square {
    constructor(public readonly x: number, public readonly y:number, public readonly size: number, public readonly grid: Grid) {
    }

    public getTotalPowerLevel(): number {
        let y: number;
        let x: number;

        let maxY: number = this.y + this.size;
        let maxX: number = this.x + this.size;

        var totalPower: number = 0;

        for (y = this.y; y < maxY; y++) {
            for (x = this.x; x < maxX; x++) {
                totalPower += this.grid.get(x, y).PowerLevel;
            }
        }

        return totalPower;
    }

    public toString(): string {
        return `${this.x},${this.y},${this.size}`;
    }
}

class SquareStat {
    public minPowerLevel: number;
    public maxPowerLevel: number;
    public numNegative: number = 0;
    public numPositive: number = 0;

    constructor(public size: number, PowerLevel: number) {
        this.minPowerLevel = PowerLevel;
        this.maxPowerLevel = PowerLevel;
    }

    public addPowerLevel(PowerLevel: number) {
        this.minPowerLevel = Math.min(this.minPowerLevel, PowerLevel);
        this.maxPowerLevel = Math.max(this.maxPowerLevel, PowerLevel);

        if (PowerLevel < 0) {
            this.numNegative++;
        } else {
            this.numPositive++;
        }
    }
}

let grid = new Grid(300, 300, 1955);

let maxSquare: Square = new Square(0, 0, 0, grid);
let maxPowerLevel: number = 0;
let squareStats: SquareStat[] = [];

let d = new Date();
console.log(d.toLocaleTimeString() + ': Start');

let lotsOfSquares = grid.getLotsOfSquares();

for(let square of lotsOfSquares) {
    let PowerLevel = square.getTotalPowerLevel();
    if (PowerLevel > maxPowerLevel) {
        maxSquare = square;
        maxPowerLevel = PowerLevel;
    }

    if (!squareStats[square.size]) {
        squareStats[square.size] = new SquareStat(square.size, PowerLevel);
    }

    squareStats[square.size].addPowerLevel(PowerLevel);

    if (square.x == 1 && square.y == 1) {
        d = new Date();
        console.log(d.toLocaleTimeString() + ': Square size: ' + square.size + ', maxSquare: ' + maxSquare.toString() + ", maxPowerLevel: " + maxPowerLevel);

        let stat = squareStats[square.size -1];

        if (stat) {
            console.log(d.toLocaleTimeString() + ': S: ' + stat.size + ', PLmin: ' + stat.minPowerLevel + ", PLmax: " + stat.maxPowerLevel + ", PLneg: " + stat.numNegative + ", PLpos: " + stat.numPositive);
        }
    }
}
