"use strict";

GameStates.makeLevelSelect = function( game, shared) {
    var title;
    var music1;
    var Button1;
    var Button2;
    var Button3;

    function startGame1(pointer) {
        music1.stop();
        game.state.start('Game1');

    }

    function startGame2(pointer) {
        music1.stop();
        game.state.start('Game2');

    }

    function startGame3(pointer) {
        music1.stop();
        game.state.start('Game3');

    }

    function quitGame() {
        game.state.start('MainMenu', true, false, music1);

    }

    return {
        init: function(music){
          music1 = music;
        },
        create: function () {
            if(music1 == null){
              music1 = game.add.audio('titleMusic');
              music1.loop = true;
              music1.play()
            }
            title = game.add.sprite(0,0, 'lvlselect');
            // game.add.sprite(0,0, 'aboutText');

            // music1 = game.add.audio('titleMusic');
            // music.loop = true;
            // music.play();

            Button1 = game.add.button( 220, 350, '1Button', startGame1, null, 'over', 'out', 'down');
            Button2 = game.add.button( 320, 350, '2Button', startGame2, null, 'over', 'out', 'down');
            Button3 = game.add.button( 420, 350, '3Button', startGame3, null, 'over', 'out', 'down');

            // When you click on the sprite, you go back to the MainMenu.
            title.inputEnabled = true;
            title.events.onInputDown.add( function() { quitGame(); }, this );


        }
    };
};
