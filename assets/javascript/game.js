$(document).ready(function () {

    let characters = [
        {name: "Chewey", image: 'assets/images/chewey.png'}, 
        {name: "R2-D2",  image: 'assets/images/r2.png'},
        {name: "Leia", image: 'assets/images/leia.png'},
        {name: "Storm Trooper", image: 'assets/images/stormtrooper.png'},
        {name: "BB-8", image: 'assets/images/bb8.png'}
    ]

    //make characters
    for (var i = 0; i < characters.length; i++) {
        let charDiv = $('<div></div>');
        let imageDiv = $('<img></img>');

        let characterImage = characters[i].image;
        let name = characters[i].name;

        charDiv.addClass('player container').attr('id', characters[i].name);
        imageDiv.attr('src', characterImage);

        $('#playerStart').append(charDiv);
        charDiv.append(imageDiv);
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
        healthVal: 100,
        /* intial player 1 health value */
        batteryVal: 0,
        /* initial value for margin-top of battery*/
        healthDecrementVal: 0,
        /* value to decrement health by */
        batteryDecrementVal: 0,
        /* value to decrement battery margin by */
    },
    opponent: {
        name: "",
        chosen: false,
        strengthRandom: 0,
        strength: 0,
        healthVal: 100,
        batteryVal: 0,
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
            target = event.target;

            switch (true) {
                /* chooses player one */
                case (!game.playerOne.chosen):
                    game.playerOne.chosen = true;
                    $(this).addClass('playerOne');
                    game.playerOne.name = $(this).attr('id');
                    game.createPlayerHealthDisplay(target);
                    game.createPlayerTitle(target);
                    break;
                /* chooses opponent */
                case (game.playerOne.chosen && !game.opponent.chosen):
                    game.opponent.chosen = true;
                    $(this).addClass('opponent');
                    game.opponent.name = $(this).attr('id');
                    game.createOpponentHealthDisplay(target);
                    game.createOpponentTitle(target);
                    // shows attack button
                    $('#attack').css('display', 'block');
                    break;
            }
        })
    },


    createPlayerHealthDisplay: function (target) {
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

        // appends the DOM
        $('.playerOne').append(health, batteryCase);
        health.append(healthSpan);
        batteryCase.append(battery);
        $('#playerHealthValDisplay').text(game.playerOne.healthVal);
    },

    createOpponentHealthDisplay: function (target) {
        // creates html elements
        let oppHealth = $('<div></div>');
        let oppHealthSpan = $('<span></span>');
        let oppBatteryCase = $('<div></div>');
        let oppBattery = $('<div></div>');

        // adds attributes to new elements
        oppHealth.attr('id', 'oppHealth');
        oppHealthSpan.attr('id', 'oppHealthValDisplay');
        oppBatteryCase.attr('id', 'oppBatteryCase');
        oppBattery.attr('id', 'oppBattery');

        // appends to the DOM
        $('.opponent').append(oppHealth, oppBatteryCase);
        oppHealth.append(oppHealthSpan);
        oppBatteryCase.append(oppBattery);
        $('#oppHealthValDisplay').text(game.opponent.healthVal);

    },

    createPlayerTitle: function(target) {
        // creates html elements
        let characterTitle = $('<div></div>');
        let characterName = $('<span></span>');

        //adds attributes to new elements
        characterTitle.addClass('characterLabel');
        characterName.addClass('characterName');

        // appends to the DOM
        $('.playerOne').append(characterTitle, characterName);
        characterTitle.text("Player One: ");
        characterName.text(game.playerOne.name);
    },

    createOpponentTitle: function(target) {
        // creates html elements
        let opponentTitle = $('<div></div>');
        let opponentName = $('<span></span>');

        //adds attributes to new elements
        opponentTitle.addClass('opponentLabel');
        opponentName.addClass('opponentName');

        // appends to the DOM
        $('.opponent').append(opponentTitle, opponentName);
        opponentTitle.text('Opponent: ');
        opponentName.text(game.opponent.name);
    },

    calcPlayerStrengths: function () {
        //creates random strength variable
        game.strengthRandom = parseInt(game.strengthsArr[Math.floor(Math.random() * game.strengthsArr.length)]);
        // assigns opponent strength a random strength
        game.opponent.strength = game.strengthRandom;

        switch (true) {
            case game.round === 0:
                this.playerOne.healthDecrementVal = game.playerOne.strength + 2;
                this.playerOne.batteryDecrementVal = game.playerOne.strength + 2;
                game.opponent.healthDecrementVal = game.opponent.strength;
                game.opponent.batteryDecrementVal = game.opponent.strength;
                break;
        }
    },

    resetOpponent: function () {
        // remove batteryCase from DOM
        $('#oppBatteryCase').removeAttr('id', 'oppBatteryCase');
        // empty and remove opponent div from DOM
        $('.opponent').empty().remove().removeClass('opponent'); 

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
            // decrement healthVal by 10
            game.opponent.healthVal -= game.opponent.healthDecrementVal; 
            // decrement battery level by 10
            game.opponent.batteryVal += game.opponent.batteryDecrementVal; 
            // update the text value of opponentHealthValDisplay
            $('#oppHealthValDisplay').text(game.opponent.healthVal); 

            $('#oppBattery').animate({
                marginTop: `${game.opponent.batteryVal}`,
                /* pass batteryVal as variable, to increase margin-top */
            }, 200, function () {
                // if opponent health drops below 0
                if (game.opponent.healthVal <= 0) {
                    //hides attack button
                    $('#attack').css('display', 'none');
                    // calls resetOpponent
                    game.resetOpponent();
                }
            })
            setTimeout(function () {
            // player one damage
                // decrement healthVal by 10
                game.playerOne.healthVal -= game.playerOne.healthDecrementVal; 
                // decrement playerBatLevel level by 10
                game.playerOne.batteryVal += game.playerOne.batteryDecrementVal; 
                // update the text value of playerHealthValDisplay
                $('#playerHealthValDisplay').text(game.playerOne.healthVal); 

                $('#battery').animate({
                    marginTop: `${game.playerOne.batteryVal}`,
                    /* pass batteryVal as variable, to increase margin-top */
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