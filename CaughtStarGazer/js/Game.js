"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var star = null;
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            // Create a sprite at the center of the screen using the 'logo' image.
            star = game.add.sprite( game.world.centerX, game.world.centerY, 'star');
            star.anchor.setTo( 0.5, 0.5 );
            star.scale.setTo(0.4,0.4);
            
            // Turn on the arcade physics engine for this sprite.
            game.physics.enable( star, Phaser.Physics.ARCADE );
            star.body.collideWorldBounds = true;
            
            
            // When you click on the sprite, you go back to the MainMenu.
            star.inputEnabled = true;
            star.events.onInputDown.add( function() { quitGame(); }, this );
        },
    
        update: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            
        }
    };
};
