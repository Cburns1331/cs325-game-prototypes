"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var star;
    var yellowStars;
    var yellowStar;
    var meteor;
    var meteors;
    var meteorCollisionGroup;
    var starCollisionGroup;
    var playerCollisionGroup;
    var music;
    var background;
    var score = 0;
    var scoreString = '';
    var scoreText;
    var lives = 3;
    var livesString = '';
    var livesText;
    var wall1;
    var wall2;
    var bust;
    var success;
    var fail;
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }

    function endGame(winLoss) {
        game.state.start('End',true, false, winLoss);
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

    function fireStars(){
        yellowStar = yellowStars.getFirstExists(false);

        if(yellowStar){
            yellowStar.frame = game.rnd.integerInRange(0,6);
            yellowStar.exists = true;
            
            yellowStar.reset(game.world.randomX, 700);
            yellowStar.scale.setTo(0.5,0.5);
            yellowStar.body.collideWorldBounds = true;

            yellowStar.body.bounce.y = 0.8;
            yellowStar.body.bounce.x = 0.8;
        }
    }

    function fireMeteor(){
        meteor = meteors.getFirstExists(false);

        if(meteor){
            meteor.frame = game.rnd.integerInRange(0,6);
            meteor.exists = true;
            
            meteor.reset(game.world.randomX, 700);
            meteor.scale.setTo(0.2,0.2);
            meteor.body.collideWorldBounds = true;

            meteor.body.bounce.y = 0.4;
            meteor.body.bounce.x = 0.4;
        }
    }

    function checkBoundsStar(yellowStar){
        if(yellowStar.y < 25){
            yellowStar.kill();
            success = game.add.audio('twinkle');
            success.play();
            score += 50;
            scoreText.text = scoreString + score;
        }
    }

    function checkBoundsMeteor(meteor){
        if(meteor.y < 25){
            meteor.kill();
            fail = game.add.audio('fail');
            fail.play();
            lives -= 1;
            livesText.text = livesString + lives;
        }
    }

    function reflect(star, yellowStar){
        
        if (yellowStar.x < star.x && yellowStar.y < star.y){
            yellowStar.body.velocity.x = -50;
            yellowStar.body.velocity.y = -50;
            return true;
        }
        else if(yellowStar.x > star.x && yellowStar.y > star.y){
            yellowStar.body.velocity.x = 50;
            yellowStar.body.velocity.y = 50;
            return true;
        }
        else if(yellowStar.x < star.x && yellowStar.y > star.y){
            yellowStar.body.velocity.x = -50;
            yellowStar.body.velocity.y = 50;
            return true;
        }
        else{
            yellowStar.body.velocity.x = 50;
            yellowStar.body.velocity.y = -50;
            return false;
        }
    }

    // function hitStar(){
    //     yellowStar.kill();
    // }

    function hitMeteor(body1, body2){
        body2.kill();
        bust = game.add.audio('rockBreak');
        bust.play();
    }
    
    return {
    
        create: function () {
            background = game.add.sprite(0, 0, 'gameBG');
            background.fixedToCamera = true;

            music = game.add.audio('gameMusic');
            music.loop = true;
            music.play();

            //  The score
            scoreString = 'Score: ';
            scoreText = game.add.text(0, 570, scoreString + score, { font: '30px Impact', fill: '#fff' });
            scoreText.fixedToCamera = true;

            //  The score
            livesString = 'Lives: ';
            livesText = game.add.text(710, 570, livesString + lives, { font: '30px Impact', fill: '#fff' });
            livesText.fixedToCamera = true;

            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.physics.arcade.gravity.y = -13;
            game.physics.arcade.restitution = 0.2;
    
            star = game.add.sprite( game.world.centerX, game.world.centerY, 'star');
            star.anchor.setTo( 0.5, 0.5 );
            star.scale.setTo(0.5,0.5);
            
            game.physics.enable( star, Phaser.Physics.ARCADE);
            star.body.collideWorldBounds = true;
            star.body.immovable = true;
            star.body.allowGravity = 0;
            star.body.bounce.y = 0.4;
            star.body.bounce.x = 0.4;


            yellowStars = game.add.group();
            yellowStars.enableBody = true;
            yellowStars.physicsBodyType = Phaser.Physics.ARCADE;
            yellowStars.createMultiple(5, 'starYellow', 0, false);
            game.time.events.loop(500, fireStars, this);

            meteors = game.add.group();
            meteors.enableBody = true;
            meteors.physicsBodyType = Phaser.Physics.ARCADE;
            meteors.createMultiple(3, 'meteor', 0, false);
            game.time.events.loop(500, fireMeteor, this);

            game.input.onDown.add(launch, this);
        },

        update: function () {
            if(score >= 5000){
                score = 0;
                lives = 3;
                music.stop();
                endGame(1);
            }
            if(lives <= 0){
                score = 0;
                lives = 3;
                music.stop();
                endGame(0);
            }
            game.physics.arcade.collide(star, yellowStars, null, reflect, this);
            // game.physics.arcade.collide(meteor, yellowStars, null, hitStar, this);
            game.physics.arcade.collide(meteors, star, null, hitMeteor, this);
            yellowStars.forEachAlive(checkBoundsStar, this);
            meteors.forEachAlive(checkBoundsMeteor, this);
            
            
        }
    };
};
