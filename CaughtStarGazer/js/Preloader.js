"use strict";

GameStates.makePreloader = function( game ) {

	var background = null;
	var preloadBar = null;

	var ready = false;

    return {
    
        preload: function () {
    
            //	These are the assets we loaded in Boot.js
            //	A nice sparkly background and a loading progress bar
            background = game.add.sprite(0, 0, 'preloaderBackground');
            preloadBar = game.add.sprite(100, 400, 'preloaderBar');
            preloadBar.scale.setTo(0.7,0.7);
    
            //	This sets the preloadBar sprite as a loader sprite.
            //	What that does is automatically crop the sprite from 0 to full-width
            //	as the files below are loaded in.
            game.load.setPreloadSprite(preloadBar);
    
            //	Here we load the rest of the assets our game needs.
            //	As this is just a Project Template I've not provided these assets, swap them for your own.
            game.load.image('titlePage', 'assets/title.gif');
            game.load.atlas('playButton', 'assets/play_button.png', 'assets/play_button.json');
            game.load.atlas('aboutButton', 'assets/aboutButton.png', 'assets/aboutButton.json');
            game.load.image('titleBar', 'assets/titlebar.png');
            game.load.audio('titleMusic', ['assets/bensound-scifi.mp3']);
            game.load.audio('gameMusic', ['assets/OSRSBeatzStart.mp3']);
            game.load.audio('twinkle', ['assets/twinkle.mp3']);
            game.load.audio('rockBreak', ['assets/Concretebreak.mp3']);
            game.load.audio('win', ['assets/shine.mp3']);
            game.load.audio('loss', ['assets/dark.mp3']);
            game.load.audio('fail', ['assets/fail.mp3']);
            //	+ lots of other required assets here
            game.load.image('star', 'assets/star.png');
            game.load.image('starYellow', 'assets/starYellow.png');
            game.load.image('gameBG', 'assets/gameBG.png');
            game.load.image('meteor', 'assets/meteor.png');
            game.load.image('aboutText', 'assets/aboutText.png');
            game.load.image('winScreen', 'assets/winScreen.png');
            game.load.image('lossScreen', 'assets/lossScreen.png');
        },
    
        create: function () {
    
            //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
            preloadBar.cropEnabled = false;
    
        },
    
        update: function () {
    
            //	You don't actually need to do this, but I find it gives a much smoother game experience.
            //	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
            //	You can jump right into the menu if you want and still play the music, but you'll have a few
            //	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
            //	it's best to wait for it to decode here first, then carry on.
            
            //	If you don't have any music in your game then put the game.state.start line into the create function and delete
            //	the update function completely.
            
            if (game.cache.isSoundDecoded('titleMusic') && ready == false)
            {
                ready = true;
                game.state.start('MainMenu');
            }
    
        }



    
    };
};
