"use strict";

window.onload = function() {

	//	Create your Phaser game and inject it into the 'game' div.
	//	We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)
	var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game' );

	//	Add the States your game has.
	//	You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.

	// An object for shared variables, so that them main menu can show
	// the high score if you want.
	var shared = {};

	game.state.add( 'Boot', GameStates.makeBoot( game ) );
	game.state.add( 'Preloader', GameStates.makePreloader( game ) );
	game.state.add( 'MainMenu', GameStates.makeMainMenu( game, shared ) );
	game.state.add( 'LevelSelect', GameStates.makeLevelSelect( game, shared ) );
	game.state.add( 'Game1', GameStates.makeGame1( game, shared ) );
	game.state.add( 'Game2', GameStates.makeGame2( game, shared ) );
	game.state.add( 'Game3', GameStates.makeGame3( game, shared ) );
	game.state.add( 'About', GameStates.makeAbout( game, shared) );
	game.state.add( 'End', GameStates.makeEnd( game, shared) );

	//	Now start the Boot state.
	game.state.start('Boot');

};
