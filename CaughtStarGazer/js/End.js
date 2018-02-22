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
                result = game.add.audio('loss');
                result.loop = true;
                result.play();
                // particle effects
                var starParticles = game.add.emitter(0, 0 , 40);
                starParticles.width = 500;
                starParticles.makeParticles('meteor');
                starParticles.angle = -45;
                starParticles.minParticleScale = 0.05;
                starParticles.maxParticleScale = 0.1;
                starParticles.minRotation = 45;
                starParticles.maxRotation = 180;
                starParticles.start(false,5000,5,0);
            }
            
            else{
                game.add.sprite(0,0,'winScreen');
                result = game.add.audio('win');
                result.loop = true;
                result.play();
                // particle effects
                var starParticles = game.add.emitter(0, 0 , 20);
                starParticles.width = 500;
                starParticles.makeParticles('star');
                starParticles.angle = -45;
                starParticles.minParticleScale = 0.05;
                starParticles.maxParticleScale = 0.1;
                starParticles.minRotation = 45;
                starParticles.maxRotation = 180;
                starParticles.start(false,5000,5,0);
                
                var starParticlesYellow = game.add.emitter(0, 0 , 20);
                starParticlesYellow.width = 500;
                starParticlesYellow.makeParticles('starYellow');
                starParticlesYellow.angle = -45;
                starParticlesYellow.minParticleScale = 0.05;
                starParticlesYellow.maxParticleScale = 0.1;
                starParticlesYellow.minRotation = 45;
                starParticlesYellow.maxRotation = 180;
                starParticlesYellow.start(false,5000,5,0);
            }
            // When you click on the sprite, you go back to the MainMenu.
            title.inputEnabled = true;
            title.events.onInputDown.add( function() { quitGame(); }, this );

        }
    };
};