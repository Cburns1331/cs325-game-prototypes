"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var music;
    var background;
    var score = 0;
    var scoreString = '';
    var scoreText;
    var lives = 3;
    var livesString = '';
    var livesText;
    var bottle;
    var bottles = 0;
    var bottlesString = '';
    var bottlesText;
    var success;
    var fail;
    var baby;
    var fallingIce;
    var fallingBottle;
    var ice;
    var iceBlocks;
    var maxSpeed = 500;
    var offset = -48;
    var offset1 = 0;
    var leftKey;
    var rightKey;
    var laugh;
    var ouch;
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }

    function endGame(winLoss) {
        game.state.start('End',true, false, winLoss);
    }

    function fireIce(){
        ice = fallingIce.getFirstExists(false);

        if(ice){
            ice.frame = game.rnd.integerInRange(0,6);
            ice.exists = true;
            
            ice.reset(game.world.randomX, -100);
            ice.scale.setTo(0.5,0.5);
            ice.body.collideWorldBounds = true;

        }
    }

    function fireBottle(){
        bottle = fallingBottle.getFirstExists(false);

        if(bottle){
            bottle.frame = game.rnd.integerInRange(0,6);
            bottle.exists = true;

            bottle.reset(game.world.randomX, -100);
            bottle.scale.setTo(0.3,0.3);
            bottle.body.collideWorldBounds = true;
        }
    }

    function checkBoundsBottle(bottle){
        if(bottle.y >= 525){
            bottle.kill();
        }
    }

    function hitBottle(body1, body2){
        body2.kill();
        bottles += 1;
        bottlesText.text = bottlesString + bottles;
        laugh = game.add.audio('laugh');
        laugh.play();
    }

    function createIce(){
        for(var x = 0; x < 7; x++){
            for(var y = 0; y < 17; y++){
                var iceBlock = iceBlocks.create(30 + y * 48,310 + x * 48, 'iceBlock');
                iceBlock.anchor.setTo(0.5,0.5);
                iceBlock.body.moves = false;
            }
        }
        //iceBlocks.x = 100;
        //iceBlocks.y = 50;
    }

    function moveRight(){
        if(baby.body.velocity.x < maxSpeed){
            baby.body.velocity.x += 50;
            return true;
        }
        else{
            baby.body.velocity.x = maxSpeed;
            return false;
        }
    }

    function moveLeft(){
        if(baby.body.velocity.x > 50){
            baby.body.velocity.x -= 50;
        }
        else{
            baby.body.velocity.x = 50;
            return false;
        }
        
    }

    function destroyIceBlock(body1, body2){
        body2.kill();
        score += 25;
        scoreText.text = scoreString + score;
    }
    
    function hitBaby(body1, body2){
        body2.kill();
        lives -= 1;
        livesText.text = livesString + lives;
        ouch = game.add.audio('ouch');
        ouch.play();
    }

    function checkBoundsIce(ice){
        if(ice.y >= 525){
            ice.kill();
        }
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
            scoreText = game.add.text(0, 10, scoreString + score, { font: '30px Gothic', fill: '#fff' });
            scoreText.fixedToCamera = true;

            //  The lives
            livesString = 'Lives: ';
            livesText = game.add.text(700, 40, livesString + lives, { font: '30px Gothic', fill: '#fff' });
            livesText.fixedToCamera = true;
            
            //  The bottles
            bottlesString = 'Bottles: ';
            bottlesText = game.add.text(683, 10, bottlesString + bottles, { font: '30px Gothic', fill: '#fff' });
            bottlesText.fixedToCamera = true;
            
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.physics.arcade.gravity.y = 20;
            game.physics.arcade.restitution = 0.4;

            baby = game.add.sprite(0, game.world.centerY, 'baby');
            baby.anchor.setTo(0.5,0.5);
            baby.scale.setTo(0.7,0.7);
            game.physics.enable(baby, Phaser.Physics.ARCADE);
            baby.body.collideWorldBounds = false;
            baby.body.immovable = true;
            baby.body.allowGravity = 0;
            baby.body.velocity.x = 50;

            iceBlocks = game.add.group();
            iceBlocks.enableBody = true;
            iceBlocks.physicsBodyType = Phaser.Physics.ARCADE;

            createIce();

            fallingIce = game.add.group();
            fallingIce.enableBody = true;
            fallingIce.physicsBodyType = Phaser.Physics.ARCADE;
            fallingIce.createMultiple(8, 'fallingIce', 0, false);
            game.time.events.loop(500, fireIce, this);

            fallingBottle = game.add.group();
            fallingBottle.enableBody = true;
            fallingBottle.physicsBodyType = Phaser.Physics.ARCADE;
            fallingBottle.createMultiple(1, 'goldenBottle', 0, false);
            game.time.events.loop(500, fireBottle, this);

            rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            rightKey.onDown.add(moveRight, this);

            leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
            leftKey.onDown.add(moveLeft, this);
            
        },
    
        update: function () {
            if(score >= 10000 || bottles >= 3){
                score = 0;
                lives = 3;
                bottles = 0;
                offset = -48;
                music.stop();
                endGame(1);
            }
            if(lives <= 0){
                score = 0;
                lives = 3;
                bottles = 0;
                offset = -48;
                music.stop();
                endGame(0);
            }

            if(baby.x >= 810){
                baby.x = -20;
                // iceBlocks.y -= 48
                // createIce();
                offset += 48;
                for(var x = 0; x < 17; x++){
                    var iceBlock = iceBlocks.create(30 + x * 48,646 + offset, 'iceBlock');
                    iceBlock.anchor.setTo(0.5,0.5);
                    iceBlock.body.moves = false;

                }
                iceBlocks.y -= 48
            }

            game.physics.arcade.collide(baby, iceBlocks, null, destroyIceBlock, this);
            game.physics.arcade.collide(fallingBottle, baby, null, hitBottle, this);
            game.physics.arcade.collide(fallingIce, baby, null, hitBaby, this);
            fallingIce.forEachAlive(checkBoundsIce, this);
            fallingBottle.forEachAlive(checkBoundsBottle, this);
            
            // if(baby.body.velocity.x < maxSpeed && offset1 > 0){
            //     baby.body.velocity.x += offset1;
            // }
            // if(baby.body.velocity.x > 50 && offset1 < 0){
            //     baby.body.velocity.x += offset1;
            // }
            
        }
    };
};
