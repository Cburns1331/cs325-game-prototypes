"use strict";

GameStates.makeMainMenu = function( game, shared ) {

	var music = null;
    var playButton = null;
    var aboutButton = null;
    var title = null;
    
    function startGame(pointer) {

        //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        music.stop();

        //	And start the actual game
        game.state.start('Game');

    }

    function aboutGame(pointer) {
        music.stop();
        game.state.start('About');
    }
    
    return {
    
        create: function () {
    
            //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
            //	Here all we're doing is playing some music and adding a picture and button
            //	Naturally I expect you to do something significantly better :)
    
            music = game.add.audio('titleMusic');
            music.loop = true;
            music.play();
    
            game.add.sprite(0, 0, 'titlePage');
            title = game.add.sprite(75, 75, 'titleBar');
    
            playButton = game.add.button( 303, 400, 'playButton', startGame, null, 'over', 'out', 'down');
            aboutButton = game.add.button( 303, 475, 'aboutButton', aboutGame, null, 'over', 'out', 'down');

            // particle effects
            var starParticles = game.add.emitter(300, -100 , 150);
            starParticles.width = 500;
            starParticles.makeParticles('snowflake');
            starParticles.angle = 0;
            starParticles.minParticleScale = 0.05;
            starParticles.maxParticleScale = 0.1;
            starParticles.minRotation = 90;
	        starParticles.maxRotation = 270;
            starParticles.start(false,5000,5,0);
    
        },
    
        update: function () {
    
            //	Do some nice funky main menu effect here
    
        }
        
    };
};
