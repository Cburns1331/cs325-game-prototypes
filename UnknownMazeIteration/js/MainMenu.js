"use strict";

GameStates.makeMainMenu = function( game, shared ) {

	var music = null;
  var playButton = null;
  var aboutButton = null;
  var title = null;

    function startGame(pointer) {

        //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        // music.stop();

        //	And start the actual game
        game.state.start('LevelSelect',true,false,music);

    }

    function aboutGame(pointer) {
			//music.stop();
      game.state.start('About', true, false, music);
    }

    return {
				init: function(music1){
					music = music1;
				},
        create: function () {
						if(music == null){
            	music = game.add.audio('titleMusic');
            	music.loop = true;
            	music.play();
						}

            game.add.sprite(0, 0, 'titlePage');
            title = game.add.sprite(75, 75, 'titleBar');

            playButton = game.add.button( 303, 275, 'playButton', startGame, null, 'over', 'out', 'down');
            aboutButton = game.add.button( 303, 350, 'aboutButton', aboutGame, null, 'over', 'out', 'down');

        },

        update: function () {

            //	Do some nice funky main menu effect here

        }

    };
};
