class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.money = 100;
        this.betEnabled = false;
    }


    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }

    setMoney(newValue){
        if (newValue.isNaN() === true) {
            if (newValue <= 0) {
                this.money = 0;
            }
            else {
                this.money = newValue;
            }

        }
        else {
            alert('will you please stop that !');
        }
    }
    getMoney() {
        return this.money;
    }
    
    setBetEnabled(validation) {
        if (typeof validation == 'boolean') {
            this.betEnabled = validation;
        }
        else{
            alert('stop messing with my datas');
        }
    }
}
export default Player