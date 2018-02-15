"use strict";
/** @param {Phaser.Game} game */

window.onload = function() {
    

    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render } );
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('man', 'assets/manrobot.png');
        game.load.image('ground', 'assets/grass.jpg')
        game.load.image('chicken', 'assets/chicken.png');
        game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
        game.load.audio('banjo', 'assets/banjo.mp3')
        
    }

    var weapon;
    var man;
    var cursors;
    var fireButton;
    var ground;
    var score = 0;
    var scoreString = '';
    var chickenString = '';
    var timeString = '';
    var stateText;

    var scoreText;
    var chickenText;
    var timeText;
    var lives;
    var explosions;
    var weapon;

    var enemies;
    var enemyBullets;
    var music;
    // var enemiesTotal = 0;
    // var enemiesAlive = 0;

    var bullets;
    var bulletTime = 0;
    var fireRate = 60;
    var firingTimer = 0;
    var timer = 0;
    var nextFire = 0;
    var total = 0;

    function create() {
        music = game.add.audio('banjo');
        music.play();
        //Game world is 1500x1500 Square
        game.world.setBounds(-750, -750, 1500, 1500);
        ground = game.add.tileSprite(0, 0, 800, 600, 'ground');
        ground.fixedToCamera = true;

        man = game.add.sprite(game.world.centerX, game.world.centerY, 'man');
        man.scale.setTo(1.5, 1.5);
        game.physics.enable(man, Phaser.Physics.ARCADE);
        man.body.drag.set(0.2);
        man.body.maxVelocity.setTo(400,400);
        man.body.collideWorldBounds = true;

        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;

        //  The score
        scoreString = 'Score: ';
        scoreText = game.add.text(0, 570, scoreString + score, { font: '30px Impact', fill: '#fff' });
        scoreText.fixedToCamera = true;

        chickenString = 'Arrow Keys to move, Mouse to shoot/aim. \n 10 waves of chickens spawn, get to 50,000 points as fast as possible.';
        chickenText = game.add.text(250, 525, chickenString, {font: '15px Arial', fill: '#fff'});
        chickenText.fixedToCamera = true;

        // //  Lives
        // lives = game.add.group();
        // var livesText = game.add.text(0, 40, 'Lives : ', { font: '34px Impact', fill: '#fff' });
        // livesText.fixedToCamera = true;
        // // for (var i = 0; i < 3; i++) {
        //     var seeThroughMan = lives.create(120/* + (30 * i)*/, 60, 'man');
        //     seeThroughMan.anchor.setTo(0.5, 0.5);
        //     seeThroughMan.alpha = 0.8;
        //     seeThroughMan.fixedToCamera = true;
        // // }


            //  Text
        stateText = game.add.text(400,300,' ', { font: '84px Impact', fill: '#fff' });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.visible = false;
        stateText.fixedToCamera = true;

        createEnemies();
        game.time.events.repeat(Phaser.Timer.SECOND * 15, 9, createEnemies, this);

        //  Our bullet group
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet');
        bullets.setAll('anchor.x', 0.1);
        bullets.setAll('anchor.y', 0.1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        // The enemy's bullets
        enemyBullets = game.add.group();
        enemyBullets.enableBody = true;
        enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemyBullets.createMultiple(30, 'enemyBullet');
        enemyBullets.setAll('anchor.x', 0.5);
        enemyBullets.setAll('anchor.y', 1);
        enemyBullets.setAll('outOfBoundsKill', true);
        enemyBullets.setAll('checkWorldBounds', true);


        //  An explosion pool
        explosions = game.add.group();
        explosions.createMultiple(30, 'kaboom');
        explosions.forEach(setupEnemies, this);

        man.bringToTop();

        game.camera.follow(man);
        game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
        game.camera.focusOnXY(0,0);

        cursors = this.input.keyboard.createCursorKeys();
        fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    }

    function setupEnemies (enemies) {
        enemies.animations.add('kaboom');
    }

    function update() {

        man.body.velocity.x = 0;
        man.body.velocity.y = 0;

        if(cursors.left.isDown) {
            man.body.velocity.x = -200;
        }
        if(cursors.right.isDown) {
            man.body.velocity.x = 200;
        }
        if(cursors.up.isDown){
            man.body.velocity.y = -200;
        }
        if(cursors.down.isDown){
            man.body.velocity.y = 200;
        }
        ground.tilePosition.x = -game.camera.x;
        ground.tilePosition.y = -game.camera.y;

        if(game.input.activePointer.isDown){
            fire();
        }
        // if (game.time.now > firingTimer)
        // {
        //     enemyFires();
        // }
        game.physics.arcade.collide(bullets, enemies, collisionHandler, null, this);
        // game.physics.arcade.collide(enemies, man, enemyHitsPlayer, null, this);
    }


    function collisionHandler (bullet, enemy){
        bullet.kill();
        enemy.kill();

        score += 50;
        scoreText.text = scoreString + score;

        // var explosion = explosions.getFirstExists(false);
        // explosion.reset(enemy.body.x, enemy.body.y);
        // explosion.play('kaboom', 30, false, true);

        if (score % 50000 == 0){

            stateText.text = " You Won, \n Click to restart";
            stateText.visible = true;

            //the "click to restart" handler
            game.input.onTap.addOnce(restart,this);
        }

        //createEnemies();

    }

    //  function enemyHitsPlayer (man,enemy) {
    
    //     stateText.text=" GAME OVER! \n Click to restart";
    //     stateText.visible = true;
    
    //     //the "click to restart" handler
    //     game.input.onTap.addOnce(restart,this);
    
    // }

    function fire() {

        if (game.time.now > nextFire && bullets.countDead() > 0)
        {
            nextFire = game.time.now + fireRate;
    
            var bullet = bullets.getFirstExists(false);
    
            if (bullet){
                //  And fire it
                bullet.reset(man.x, man.y + 8);
                bullet.body.velocity.y = -400;
                bulletTime = game.time.now + 200;
            }
    
            game.physics.arcade.moveToPointer(bullet, 300);
        }
    
    }

    function createEnemies(){
        //var rand = Math.floor(Math.random() * 8) + 1;
        for(var total1 = 0; total1 < 100; total1++){
            var enemy = enemies.create(-(Math.random()*800), game.world.randomY, 'chicken');
        
            enemy.angle = game.rnd.angle();
            enemy.scale.setTo(0.2, 0.2);
            enemy.anchor.setTo(0.5,0.5);
            //enemy.animations.add('kaboom');
        }
        //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
        var tween = game.add.tween(enemies).to( { x: 500 }, 500, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //  When the tween loops it calls descend
        tween.onLoop.add(descend, this);
    }

    function descend() {

        enemies.y += 50;
    
    }

    function restart () {
        game.state.start(game.state.current);
    }

    function render() {

        game.debug.text("Time until event: " + game.time.events.duration.toFixed(0), 32, 32);
        //game.debug.text("Next tick: " + game.time.events.next.toFixed(0), 32, 64);
    
    }
    
};
