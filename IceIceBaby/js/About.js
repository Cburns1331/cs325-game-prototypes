"use strict";

GameStates.makeAbout = function( game, shared ) {
    var title;
    var music;

    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        music.stop();
        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }

    return {
        create: function () {
            title = game.add.sprite(0,0, 'titlePage');
            game.add.sprite(0,0, 'aboutText');

            music = game.add.audio('titleMusic');
            music.loop = true;
            music.play();

            // When you click on the sprite, you go back to the MainMenu.
            title.inputEnabled = true;
            title.events.onInputDown.add( function() { quitGame(); }, this );

        }
    };
};