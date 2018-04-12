"use strict";

GameStates.makeEnd = function( game, shared ) {
    var temp;
    var result;
    var title;
    var endMusic;

    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        endMusic.stop();
        endMusic = null;
        game.state.start('LevelSelect');

    }

    return {
        init: function(winLoss) {
            temp = winLoss;
        },
        create: function () {
            title = game.add.sprite(0,0,'titlePage');
            if(temp == 1){
              endMusic = game.add.audio('DrunkenSailor');
              endMusic.loop = true;
              endMusic.play();
                game.add.sprite(0,0,'winScreen');

            }

            else{
              endMusic = game.add.audio('Becalmed');
              endMusic.fadeIn(4000);
              endMusic.loop = true;
              //endMusic.play();
                game.add.sprite(0,0,'lossScreen');


            }
            // When you click on the sprite, you go back to the MainMenu.
            title.inputEnabled = true;
            title.events.onInputDown.add( function() { quitGame(); }, this );

        }
    };
};
