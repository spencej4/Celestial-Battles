$(document).ready(function () {
    // inform user to press any key to start the game
    initializeDisplay.textContent = "Press Any Key";
    // makes characters
    game.makeCharacters();
    // starts game on any keypress
    document.onkeyup = function () {
        game.initiateGame();
    }
});


let game = {
    round: 1,
    introStopped: false,
    playerStartActive: true,
    strengthsArr: [1, 2, 16, 17],
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
    themeSong: {
        theme: document.createElement("audio"),

        playThemeSong: function () {
            // let themeSong = document.createElement("audio");
            this.theme.src = "assets/audio/openingCrawl.mp3";
            this.theme.play();
        },

        fadeOut: function () {
            // this.themeSong.empty();
            this.theme.src = 'assets/audio/fadeOut.mp3';
            this.theme.play();
        }
    },

    makeCharacters: function () {
        let characters = [{name: "Chewbacca", image: 'assets/images/chewey.png'},
            {name: "R2-D2", image: 'assets/images/r2.png'},
            {name: "Leia", image: 'assets/images/leia.png'},
            {name: "Storm Trooper", image: 'assets/images/stormtrooper.png'},
            {name: "BB-8", image: 'assets/images/bb8.png'}
        ]

        // function to shuffle indexes of an array
        function shuffleCharacters(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
            }
            return array;
        }

        // randomizes characters array
        characters = shuffleCharacters(characters);

        //make characters
        for (var i = 0; i < characters.length; i++) {
            let charDiv = $('<div></div>');
            let imageDiv = $('<img></img>');

            let characterImage = characters[i].image;
            let name = characters[i].name;

            charDiv.addClass('player container').attr('id', name);
            imageDiv.attr('src', characterImage);

            $('#playerStart').append(charDiv);
            charDiv.append(imageDiv);
        }
    },

    initiateGame: function () {
        $('#initializeDisplay').css('display', 'none');
        $('#game').css('display', 'block');

        // let themeSong = document.createElement("audio");
        // themeSong.src = "assets/audio/openingCrawl.mp3";
        // themeSong.play();

        this.themeSong.playThemeSong();
        // $("#my_audio").get(0).play();
        this.attack();
        this.choosePlayers();
    },

    fadeIntro: function () {
        // fades intro divs when user clicks a character
        $('#board').fadeOut(2000);
        $('.logo, .intro').fadeOut(2000);
        game.introStopped = true;
    },

    choosePlayers: function () {
        $('.player').click(function () {
            // if user clicks on a character during intro
            if (game.introStopped === false) {
                // fades out intro
                game.fadeIntro();
                // playes fadeout sound
                game.themeSong.fadeOut();
            }
            game.calcPlayerStrengths();
            target = event.target;

            switch (true) {
                //chooses player one 
                case (!game.playerOne.chosen):
                    game.playerOne.chosen = true;
                    $(this).addClass('playerOne');
                    game.playerOne.name = $(this).attr('id');
                    game.createPlayerHealthDisplay(target);
                    game.createPlayerTitle(target);
                    break;
                //chooses opponent 
                case (game.playerOne.chosen && !game.opponent.chosen):
                    game.opponent.chosen = true;
                    $(this).addClass('opponent');
                    game.opponent.name = $(this).attr('id');
                    game.createOpponentHealthDisplay(target);
                    game.createOpponentTitle(target);
                    // calls showAttack to show atttack button
                    game.showAttack();
                    // tells player which round has just started
                    game.showMessage(`Round #${game.round}`);
                    break;
            }
        })
    },

    showAttack: function () {
        // shows attack button
        $('#attack').css('display', 'block');
    },

    hideAttack:  function() {
        $('#attack').css('display', 'none');
    },

    showMessage: function (message) {
        // uses message variable passed as param to showMessage function
        $('#messages').html(message);
        // fade message in, then out
        $('#messages').fadeIn(1000, function () {
            $('#messages').fadeOut(3000);
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

    createPlayerTitle: function (target) {
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

    createOpponentTitle: function (target) {
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


        for (var i=0; i < 5; i++) {
            game.playerOne.healthDecrementVal = game.playerOne.strength + 2;
            game.playerOne.batteryDecrementVal = game.playerOne.strength + 2;
            game.opponent.healthDecrementVal = game.opponent.strength;
            game.opponent.batteryDecrementVal = game.opponent.strength;
        }
    },

    playAttackSound: function () {
        let myAudio = document.createElement("audio");
        myAudio.src = "assets/audio/pew.mp3";
        myAudio.play();
    },


    attack: function () {
        $('#attack').click(function () {
            // decrement healthVal by 10
            game.opponent.healthVal -= game.opponent.healthDecrementVal;
            // decrement battery level by 10
            game.opponent.batteryVal += game.opponent.batteryDecrementVal;
            // update the text value of opponentHealthValDisplay
            $('#oppHealthValDisplay').text(game.opponent.healthVal);
            game.playAttackSound();

            // show lazers
            $('.playerLazer').css('display', 'block');
            setTimeout(function () {
                // hide lazers
                $('.playerLazer').css('display', 'none');
            }, 200);

            // animate the battery
            $('#oppBattery').animate({
                // pass batteryVal as variable, to increase margin-top 
                marginTop: `${game.opponent.batteryVal}`,
            }, 200, function () {
                // if opponent health drops below 0
                if (game.opponent.healthVal <= 0) {
                    //hides attack button
                    game.hideAttack();
                    // calls showMessage
                    game.showMessage(`You defeated ${game.opponent.name}`);
                    // calls resetOpponent
                    game.resetOpponent();
                    // calls updateRoundCount
                    game.updateRoundCount();
                }
            })
            setTimeout(function () {
                // decrement healthVal by 10
                game.playerOne.healthVal -= game.playerOne.healthDecrementVal;
                // decrement playerBatLevel level by 10
                game.playerOne.batteryVal += game.playerOne.batteryDecrementVal;
                // update the text value of playerHealthValDisplay
                $('#playerHealthValDisplay').text(game.playerOne.healthVal);

                // show lazers
                $('.opponentLazer').css('display', 'block');  
                setTimeout(function () {
                    // hide lazers
                    $('.opponentLazer').css('display', 'none');
                }, 200);

                // animates the battery
                $('#battery').animate({
                    // passes batteryVal as variable, to increase margin-top 
                    marginTop: `${game.playerOne.batteryVal}`,
                }, 200, function () {
                    // if player one health drops below 0
                    if (game.playerOne.healthVal <= 0) {
                        // removes player from the DOM 
                        $('.playerOne').remove().removeClass('playerOne');
                        // calls showMessage
                        game.showMessage(`${game.opponent.name} defeated you.`);
                        // calls updateRoundCount
                        game.updateRoundCount();
                        // hides attack button
                        game.hideAttack();
                        // removes players from DOM
                        game.clearCharacters();
                        // shows play again button
                        game.showPlayAgain();
                        // slides playerStart up
                        // game.togglePlayerStart();
                        game.slideUpPlayers();
                    }
                })
            }, 200);
        })
    },

    resetOpponent: function () {
        // removes batteryCase from DOM
        $('#oppBatteryCase').removeAttr('id', 'oppBatteryCase');
        // empties and remove opponent div from DOM
        $('.opponent').empty().remove().removeClass('opponent');

        game.opponent.chosen = false;
        game.opponent.batteryVal = 0;
        game.opponent.batteryDecrementVal = 0;
        game.opponent.healthVal = 100;
        game.choosePlayers();
    },

    updateRoundCount: function () {
        game.round++;

        // player defeated opponent
        if (game.round >= 5) {
            game.roud = 1;
            game.clearCharacters();
            game.slideUpPlayers();
            // call showPlayAgain
            game.showPlayAgain();
            game.showMessage(`${game.playerOne.name} has attained victory!`);
        }
    },

    slideUpPlayers: function() {
        $('#playerStart').css("transform", "translateY(-125px)");
    },

    slideDownPlayers: function() {
        $('#playerStart').css("transform", "translateY(0px)");
    },

    showPlayAgain: function () {
        // shows play again button
        $('#playAgain').css('display', 'block');
        // resets game 
        $('#playAgain').click(function () {
            game.clearCharacters();
            game.playAgain();
        });
    },

    playAgain: function () {
        // hides play again button
        $('#playAgain').css('display', 'none');
        // makes characters, appends to DOM
        this.makeCharacters();
        game.round = 1;
        game.themeSong.fadeOut();
        game.slideDownPlayers();
        this.attack();
        this.choosePlayers();
        // resets game values
        game.playerOne = {
            name: "",
            chosen: false,
            strength: 0,
            healthVal: 100,
            batteryVal: 0,
            healthDecrementVal: 0,
            batteryDecrementVal: 0,
        }
        game.opponent = {
            name: "",
            chosen: false,
            strengthRandom: 0,
            strength: 0,
            healthVal: 100,
            batteryVal: 0,
            healthDecrementVal: 0,
            batteryDecrementVal: 0,
        }
    },

    clearCharacters: function () {
        // empties playerStart div, removes all characters
        $('#playerStart').empty();
    }
}