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

    function launch(){
        if (game.input.x < star.x && game.input.y < star.y){
            star.body.velocity.x = 200;
            star.body.velocity.y = 200;
        }
        else if(game.input.x > star.x && game.input.y > star.y){
            star.body.velocity.x = -200;
            star.body.velocity.y = -200;
        }
        else if(game.input.x < star.x && game.input.y > star.y){
            star.body.velocity.x = 200;
            star.body.velocity.y = -200;
        }
        else{
            star.body.velocity.x = -200;
            star.body.velocity.y = 200;
        }
    }

    function hitYellowStar(body1, body2){
        body2.sprite.alpha -= 0.5;
    }

    
    return {
    
        create: function () {
            var background = game.add.sprite(0, 0, 'gameBG');
            background.fixedToCamera = true;

            var music = game.add.audio('gameMusic');
            music.loop = true;
            music.play();

            game.physics.startSystem(Phaser.Physics.P2JS);
            game.physics.p2.setImpactEvents(true);
            var meteorCollisionGroup = game.physics.p2.createCollisionGroup();
            var starCollisionGroup = game.physics.p2.createCollisionGroup();
            var playerCollisionGroup = game.physics.p2.createCollisionGroup();

            game.physics.p2.updateBoundsCollisionGroup();
            game.physics.p2.gravity.y = 100;
            game.physics.p2.restitution = 0.8;
    
            star = game.add.sprite( game.world.centerX, game.world.centerY, 'star');
            star.anchor.setTo( 0.5, 0.5 );
            star.scale.setTo(0.2,0.2);
            
            // Turn on the arcade physics engine for this sprite.
            game.physics.enable( star, Phaser.Physics.P2JS);
            star.body.collideWorldBounds = true;
            star.body.setCollisionGroup(playerCollisionGroup);
            star.body.collides(starCollisionGroup, hitYellowStar, this);

            var yellowStars = game.add.group();
            yellowStars.enableBody = true;
            yellowStars.physicsBodyType = Phaser.Physics.P2JS;

            for(var i = 0; i < 4; i++){
                yellowStars.create(360 + Math.random() * 200, 120 + Math.random() * 200, 'starYellow');;
            }

            var meteors = game.add.group();
            meteors.enableBody = true;
            meteors.physicsBodyType = Phaser.Physics.P2JS;

            
            game.input.onDown.add(launch, this);
            // // When you click on the sprite, you go back to the MainMenu.
            // star.inputEnabled = true;
            // star.events.onInputDown.add( function() { quitGame(); }, this );
        },

        update: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            
        }
    };
};
