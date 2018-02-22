"use strict";

GameStates.makeAbout = function( game, shared ) {
    var title;

    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }

    return {
        create: function () {
            title = game.add.sprite(0,0, 'titlePage');
            game.add.sprite(0,0, 'aboutText');

            // When you click on the sprite, you go back to the MainMenu.
            title.inputEnabled = true;
            title.events.onInputDown.add( function() { quitGame(); }, this );

        }
    };
};