$(document).ready(function () {
    let characters = ["hans solo", "r2", "leia", "storm trooper", "kylo ren"];

    //make characters
    for (var i = 0; i < characters.length; i++) {
        let charDiv = $('<div></div>');
        charDiv.addClass('player container').attr('id', characters[i]);
        $('#playerStart').append(charDiv);
    }
    game.initiateGame();
});


let game = {
    round: 0,
    strengthsArr: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    playerOne: {
        name: "",
        chosen: false,
        strength: 0,
        healthVal: 100, /* intial player 1 health value */
        batteryVal: 0,  /* initial value for margin-top of battery*/
        healthDecrementVal: 0, /* value to decrement health by */
        batteryDecrementVal: 0,   /* value to decrement battery margin by */
    },
    opponent: {
        name: "",
        chosen: false,
        strengthRandom: 0,
        strength: 0,
        healthVal: 100, /* intial opponent health value */
        batteryVal: 0, /* initial value for margin-top of battery*/
        healthDecrementVal: 0,
        batteryDecrementVal: 0,
    },

    initiateGame: function () {
        this.attack();
        this.choosePlayers();
    },


    choosePlayers: function () {

        $('.player').click(function () {
            game.calcPlayerStrengths();

            switch (true) {
                /* chooses player one */
                case (!game.playerOne.chosen):
                    game.playerOne.chosen = true;
                    $(this).addClass('playerOne');
                    // creates html elements
                    let health = $('<div></div>');
                    let healthSpan = $('<span></span>');
                    let batteryCase = $('<div></div>');
                    let battery = $('<div></div>');
                    // adds attributes to new elements
                    health.attr('id', 'health');
                    healthSpan.attr('id', 'playerHealthValDisplay');
                    batteryCase.attr('id', 'batteryCase');
                    battery.attr('id', 'battery');
                    // appends new elements to html
                    $('.playerOne').append(health, batteryCase);
                    health.append(healthSpan);
                    batteryCase.append(battery);
                    $('#playerHealthValDisplay').text(game.playerOne.healthVal);
                    // shows the health and battery
                    $('#health, #batteryCase, #battery').css("display", "block");
                    // gives splayer one a name
                    game.playerOne.name = $(this).attr('id');
                    break;
                /* chooses opponent */
                case (game.playerOne.chosen && !game.opponent.chosen):
                    game.opponent.chosen = true;
                    $(this).addClass('opponent');
                    let oppHealth = $('<div></div>');
                    let oppHealthSpan = $('<span></span>');
                    let oppBatteryCase = $('<div></div>');
                    let oppBattery = $('<div></div>');
                    oppHealth.attr('id', 'oppHealth');
                    oppHealthSpan.attr('id', 'oppHealthValDisplay');
                    oppBatteryCase.attr('id', 'oppBatteryCase');
                    oppBattery.attr('id', 'oppBattery');
                    $('.opponent').append(oppHealth, oppBatteryCase);
                    oppHealth.append(oppHealthSpan);
                    oppBatteryCase.append(oppBattery);
                    $('#oppHealthValDisplay').text(game.opponent.healthVal);
                    $('#oppHealth, #oppBatteryCase, #oppBattery').css("display", "block");
                    game.opponent.name = $(this).attr('id');
                    // game.opponent.healthVal = 100;
                    break;
            }
        })
    },

    calcPlayerStrengths: function () {
        game.strengthRandom = parseInt(game.strengthsArr[Math.floor(Math.random() * game.strengthsArr.length)]);
        game.opponent.strength = game.strengthRandom;
        console.log(`Opponent Strength: ${game.opponent.strength}`);

        switch (true) {
            case game.round === 0:
                this.playerOne.healthDecrementVal = game.playerOne.strength + 2;
                this.playerOne.batteryDecrementVal = game.playerOne.strength + 2;
                game.opponent.healthDecrementVal = game.opponent.strength;
                // console.log(`Opp Health Decrement Value: ${game.opponent.healthDecrementVal}`);
                game.opponent.batteryDecrementVal = game.opponent.strength;
                break;
        }
    },

    resetOpponent: function() {
        $('#oppBatteryCase').removeAttr('id', 'oppBatteryCase'); /* remove batteryCase from DOM */
        $('.opponent').empty().remove().removeClass('opponent'); /* empty and remove opponent div from DOM */
        game.opponent.chosen = false;   
        game.opponent.batteryVal = 0;
        game.opponent.batteryDecrementVal = 0;
        game.opponent.healthVal = 100;
        
        // call choosePlayers
        game.choosePlayers();
    },


    attack: function () {

        $('#attack').click(function () {   
            // opponent damage
            game.opponent.healthVal -= game.opponent.healthDecrementVal;    /* decrement healthVal by 10 */
            game.opponent.batteryVal += game.opponent.batteryDecrementVal;    /* decrement battery level by 10 */
            $('#oppHealthValDisplay').text(game.opponent.healthVal); /* update the text value of playerHealthValDisplay */

            $('#oppBattery').animate({
                marginTop: `${game.opponent.batteryVal}`,     /* pass batteryVal as variable, to increase margin-top */
            }, 200, function () {
                // if opponent health drops below 0
                if(game.opponent.healthVal <= 0) {
                    // calls resetOpponent
                    game.resetOpponent();
                }
            })
            setTimeout(function () { 
                // player one damage
                game.playerOne.healthVal -= game.playerOne.healthDecrementVal; /* decrement healthVal by 10 */
                game.playerOne.batteryVal += game.playerOne.batteryDecrementVal; /* decrement playerBatLevel level by 10 */
                $('#playerHealthValDisplay').text(game.playerOne.healthVal); /* update the text value of playerHealthValDisplay */

                $('#battery').animate({
                    marginTop: `${game.playerOne.batteryVal}`,     /* pass baterryVal as variable, to ncrease margin-top */
                }, 200, function () {
                    // if player one health drops below 0
                    if (game.playerOne.healthVal <= 0) {
                        console.log('You died');
                        // remove player from the DOM 
                        $('.playerOne').remove().removeClass('playerOne');
                    }
                })
            }, 300);
        })
    }
}