var FuelCell = /** @class */ (function () {
    function FuelCell(x, y, gridSerial) {
        this.x = x;
        this.y = y;
        var rackID = x + 10;
        var PowerLevel = rackID * y;
        PowerLevel += gridSerial;
        PowerLevel *= rackID;
        if (PowerLevel < 100) {
            PowerLevel = 0;
        }
        PowerLevel = Math.floor((PowerLevel / 100) % 10);
        PowerLevel -= 5;
        this.PowerLevel = PowerLevel;
    }
    return FuelCell;
}());
var f = new FuelCell(3, 5, 8);
