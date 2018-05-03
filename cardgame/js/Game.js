"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var gameMusic;
    var background;
    var winLoss;
    var keyEsc;
    var escCtr = 0;
    var menu;
    var resumeButton, quitButton;
    var deck;
    var cardsInGame;
    var cardIndex, nextCardIndex;
    var keyUp,keyDown;
    var bal =100;
    var balString = '';
    var balText;
    var winStreak = 0;
    var winString = '';
    var winText;
    var lossStreak = 0;
    var lossString = '';
    var lossText;
    var dealing;


    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }

    function endGame(winLoss) {
        gameMusic.stop();
        game.state.start('End',true,false,winLoss);
    }


    function pauseMenu(){
      if(game.physics.arcade.isPaused == false){
        escCtr+= 1;
      }
      if(escCtr % 2 != 0 || game.physics.arcade.isPaused == false){
          escCtr-=1;
          togglePause();
          gameMusic.pause();
          menu = game.add.sprite(75,50,'pauseMenu');
          menu.fixedToCamera = true;
          resumeButton = game.add.button( 303, 275, 'resumeButton', unpause, null, 'over', 'out', 'down');
          resumeButton.fixedToCamera = true;
          quitButton = game.add.button( 303, 350, 'quitButton', endGame, null, 'over', 'out', 'down');
          quitButton.fixedToCamera = true;
      }
      else{
        unpause();
      }
    }

    function togglePause() {

      game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;

    }

    function unpause(event){
          menu.destroy();
          resumeButton.destroy();
          quitButton.destroy();
          togglePause();
          gameMusic.resume();
    }

    function makeCard(cardIndex){
      var card = game.add.sprite(334 * 0.4 / -2, 650 / 2, "cards");
      card.anchor.set(0.5);
      card.scale.set(.4);
      card.frame = deck[cardIndex];
      card.inputEnabled = true;
      return card;

    }


    function upGuess(){
      var dir = -1;
      var cardToMove = (nextCardIndex + 1) % 2;
      //cardsInGame[cardToMove].y += 440 * .8 * 1.1;
      var tween = game.add.tween(cardsInGame[cardToMove]).to({
            x: ((game.width / 2) - 150)
        }, 500, Phaser.Easing.Cubic.Out, true);
        tween.onComplete.add(function() {
            var newCard = deck[nextCardIndex - 1];
            var oldCard = deck[nextCardIndex - 2];
            if(((dir == -1) && ((newCard % 13 > oldCard % 13) || ((newCard % 13 == oldCard % 13) && (newCard > oldCard)))) || ((dir == 1) && ((newCard % 13 < oldCard % 13) || ((newCard % 13 == oldCard % 13) && (newCard < oldCard))))){
              var chaching = game.add.audio('chaching');
              chaching.play();
                game.time.events.add(Phaser.Timer.SECOND, moveCards, this)
            }
            else{
              var chips = game.add.audio('chips');
              chips.play();
                game.time.events.add(Phaser.Timer.SECOND, fadeCards, this)
            }
        }, this)
    }

    function downGuess(){
      var dir = 1;
      var cardToMove = (nextCardIndex + 1) % 2;
        //cardsInGame[cardToMove].y += -1 * 440 * .8 * 1.1;
        var tween = game.add.tween(cardsInGame[cardToMove]).to({
            x: ((game.width / 2) - 150)
        }, 500, Phaser.Easing.Cubic.Out, true);
        tween.onComplete.add(function() {
            var newCard = deck[nextCardIndex - 1];
            var oldCard = deck[nextCardIndex - 2];
            if(((dir == -1) && ((newCard % 13 > oldCard % 13) || ((newCard % 13 == oldCard % 13) && (newCard > oldCard)))) || ((dir == 1) && ((newCard % 13 < oldCard % 13) || ((newCard % 13 == oldCard % 13) && (newCard < oldCard))))){
              var chaching = game.add.audio('chaching');
              chaching.play();
                game.time.events.add(Phaser.Timer.SECOND, moveCards, this)
            }
            else{
                var chips = game.add.audio('chips');
                chips.play();
                game.time.events.add(Phaser.Timer.SECOND, fadeCards, this)
            }
        }, this)
    }

    function moveCards(){
      lossStreak = 0;
      lossText.text = lossString + lossStreak;
      winStreak += 1;
      winText.text = winString + winStreak;
      if(winStreak < 3){
        bal += 20;
      }
      else{
        bal += 100;
      }
      var fadeTween = game.add.tween(cardsInGame[0]).to({
          alpha: 10
      }, 500, Phaser.Easing.Linear.None, true);
      balText.text = balString + bal;
      var cardToMove = nextCardIndex % 2;
      var moveOutTween = game.add.tween(cardsInGame[cardToMove]).to({
          x: game.width /2
      }, 500, Phaser.Easing.Cubic.Out, true);
      cardToMove = (nextCardIndex + 1) % 2
      var moveDownTween = game.add.tween(cardsInGame[cardToMove]).to({
          x: game.width / 2
      }, 500, Phaser.Easing.Cubic.Out, true);
      moveDownTween.onComplete.add(function() {
            var cardToMove = nextCardIndex % 2
            cardsInGame[cardToMove].frame = deck[nextCardIndex];
            nextCardIndex = (nextCardIndex + 1) % 52;
            cardsInGame[cardToMove].x = 334 * .8 / -2;
            keyUp.onDown.add(upGuess, this);
            keyDown.onDown.add(downGuess,this);
        }, this)
    }

    function fadePicture() {

      game.add.tween(dealing).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);

    }

    function fadeCards(){
      dealing = game.add.sprite(300,150,'dealing');
      game.time.events.add(Phaser.Timer.SECOND, fadePicture, this);
      winStreak = 0;
      winText.text = winString + winStreak;
      lossStreak += 1;
      lossText.text = lossString + lossStreak;
      if(lossStreak < 3){
        bal -= 30;
      }
      else{
        bal -= 125;
      }
      balText.text = balString + bal;
      for(var i = 0; i < 2; i++){
            var fadeTween = game.add.tween(cardsInGame[i]).to({
                alpha: 0
            }, 500, Phaser.Easing.Linear.None, true);
            game.time.events.add(Phaser.Timer.SECOND, function(){
            setup();
        }, this)
        }
    }

    function setup(){
      deck = Phaser.ArrayUtils.numberArray(0,51);
      Phaser.ArrayUtils.shuffle(deck);
      cardsInGame = [makeCard(0), makeCard(1)];
      var tween = game.add.tween(cardsInGame[0]).to({
        x: game.width / 2
      }, 500, Phaser.Easing.Cubic.Out, true);
      nextCardIndex = 2;
    }

    return {
      init: function(music){
        gameMusic = music;
      },
        create: function () {
          if(gameMusic == null){
              gameMusic = game.add.audio('titleMusic');
              gameMusic.loop = true;
              gameMusic.play()
            }
          game.world.setBounds(0,0,800,600);
          game.stage.backgroundColor = "#28B463";
          setup();
          //deal9(cardsInGame);

          keyUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
          keyUp.onDown.add(upGuess, this);

          keyDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
          keyDown.onDown.add(downGuess,this);

          //  The bal
            balString = 'Balance: ';
            balText = game.add.text(0, 10, balString + bal, { font: '30px Gothic', fill: '#fff' });
            balText.fixedToCamera = true;

            //  The winstreak
              winString = 'Win Streak: ';
              winText = game.add.text(0, 50, winString + winStreak, { font: '30px Gothic', fill: '#fff' });
              winText.fixedToCamera = true;

              //  The bal
                lossString = 'Loss Streak: ';
                lossText = game.add.text(0, 90, lossString + lossStreak, { font: '30px Gothic', fill: '#fff' });
                lossText.fixedToCamera = true;

            var infoString = "Aces are low card! Get a 3+ win/loss streak and win or lose large! \nPress ESC to pause!"
            var infoText = game.add.text(5,500, infoString, {font: '30px Gothic', fill: '#fff'});
            infoText.fixedToCamera = true;



          keyEsc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
          keyEsc.onDown.add(pauseMenu, this);

        },

        update: function () {
          if(bal <=0){
            bal = 100;
            winStreak = 0;
            lossStreak = 0;
            endGame(-1);
          }
          else if(bal >=500){
            bal = 100;
            winStreak = 0;
            lossStreak = 0;
            endGame(1);
          }
        }
    };
};
