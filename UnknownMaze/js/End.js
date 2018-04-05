"use strict";

GameStates.makeEnd = function( game, shared ) {
    var temp;
    var result;
    var title;

    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        result.stop();
        result = null;
        game.state.start('MainMenu');

    }

    return {
        init: function(winLoss) {
            temp = winLoss;
        },
        create: function () {
            title = game.add.sprite(0,0,'titlePage');
            if(temp == 0){
                game.add.sprite(0,0,'lossScreen');

            }

            else{
                game.add.sprite(0,0,'winScreen');


            }
            // When you click on the sprite, you go back to the MainMenu.
            title.inputEnabled = true;
            title.events.onInputDown.add( function() { quitGame(); }, this );

        }
    };
};
