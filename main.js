class Neck {}

class Strings {}

class Body {}

class Guitar {
    constructor(neck, strings, body) {
        this.neck = neck;
        this.strings = strings;
        this.body = body;
        this.isTuned = false;
        this.isFaulty = Math.random() < 0.7;
        if (!this.isFaulty) {
            this.isTuned = true; // Only tuned guitars are playable
        }
    }

    tune() {
        this.isTuned = true;
    }

    isPlayable() {
        if (
            this.neck instanceof Neck &&
            this.strings instanceof Strings &&
            this.body instanceof Body &&
            this.isTuned &&
            !this.isFaulty
        ) {
            console.log("Guitar is playing just fine!");
            return true;
        } else {
            console.log("The guitar is not playable!");
            return false;
        }
    }
}

class Supplier {
    constructor(frequencyInSeconds, SupplyClass) {
        this.frequencyInSeconds = frequencyInSeconds;
        this.lastDeliveryDateTime = null;
        this.SupplyClass = SupplyClass;
        this.deliveredCount = 0; //  counter for delivered supplies
    }

    delivery() {
        const now = new Date().getTime();
        if (
            !this.lastDeliveryDateTime ||
            now - this.lastDeliveryDateTime >= this.frequencyInSeconds * 1000
        ) {
            this.lastDeliveryDateTime = now;
            const supplies = [];
            const supplyCount = Math.floor(Math.random() * 4) + 3; // Random supply count between 3 and 6
            for (let i = 0; i < supplyCount; i++) {
                const supply = new this.SupplyClass();
                supplies.push(supply);
                this.deliveredCount++; // Increment supplies count
            }
            console.log(`Delivery of ${supplies.length} ${this.SupplyClass.name} at ${new Date()}`);
            return supplies;
        } else {
            return null;
        }
    }
}

class NeckSupplier extends Supplier {
    constructor() {
        super(3, Neck);
    }
}

class StringsSupplier extends Supplier {
    constructor() {
        super(4, Strings);
    }
}


class Storage {
    constructor() {
        this.instrumentsArray = [];
    }

    storeInstrument(guitar) {
        this.instrumentsArray.push(guitar);
        console.log("Guitar stored in the storage.");
    }
}

class Factory {
    constructor() {
        this.neckSupplier = new NeckSupplier();
        this.stringsSupplier = new StringsSupplier();
        this.storage = new Storage();
        this.necksArray = [];
        this.stringsArray = [];
    }

    produceBody() {
        return new Body();
    }

    runProductionLine() {
        const necks = this.neckSupplier.delivery();
        const strings = this.stringsSupplier.delivery();

        if (!necks || !strings) {
            setTimeout(() => this.runProductionLine(), 1000 * 2); // Retry after 2 seconds
            return;
        }

        this.necksArray.push(...necks);
        this.stringsArray.push(...strings);

        const guitarCount = Math.min(necks.length, strings.length);

        for (let i = 0; i < guitarCount; i++) {
            const guitar = new Guitar(necks[i], strings[i], this.produceBody());
            guitar.tune();
            if (guitar.isPlayable()) {
                console.log("Guitar is tuned!");
                this.storage.storeInstrument(guitar);
            } else {
                console.log("Guitar does not pass quality check.");
            }
        }

        console.log(`Number of guitars in storage: ${this.storage.instrumentsArray.length}`);
        console.log(`Total delivered necks: ${this.neckSupplier.deliveredCount}`);
        console.log(`Total delivered strings: ${this.stringsSupplier.deliveredCount}`);

        this.runProductionLine(); // Continue production every 2 seconds
        console.log('==================')
    }
}

const factory = new Factory();
factory.runProductionLine();
