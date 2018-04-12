"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var music;
    var background;
    var ship;
    var currentDirection = Phaser.NONE;
    var map;
    var layer;
    var cursors;
    var rightKey, leftKey, upKey, downKey;
    var fogOfWar;
    var bmd;
    var fringe;
    var safetile = 1;
    var marker = new Phaser.Point();
    var turnPoint = new Phaser.Point();
    var directions = [null, null, null, null, null];
    var opposites = [Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP];
    var turning = Phaser.NONE;
    var threshold = 3;
    var menFound = 0;
    var menFoundString = '';
    var menFoundText;
    var lostMen;
    var hooray;


    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }

    function endGame(winLoss) {
        game.state.start('End',true, false, winLoss);
    }

    function checkKeys(){
      if(cursors.left.isDown && currentDirection != Phaser.LEFT){
        checkDirection(Phaser.LEFT);
      }
      else if(cursors.right.isDown && currentDirection != Phaser.RIGHT){
        checkDirection(Phaser.RIGHT);
      }
      else if(cursors.up.isDown && currentDirection != Phaser.UP){
        checkDirection(Phaser.UP);
      }
      else if(cursors.down.isDown && currentDirection != Phaser.DOWN){
        checkDirection(Phaser.DOWN);
      }
      else{
        turning = Phaser.NONE;
      }
    }

    function checkDirection(turnTo){
      if(turning == turnTo || directions[turnTo] == null || directions[turnTo].index != safetile){
        return;
      }
      if(currentDirection == opposites[turnTo]){
        move(turnTo);
      }
      else{
        turning = turnTo;
        turnPoint.x = (marker.x * 32) + (32 / 2);
        turnPoint.y = (marker.y * 32) + (32 / 2);
      }
    }

    function turn(){
      var cx = Math.floor(ship.x);
      var cy = Math.floor(ship.y);
        //  This needs a threshold, because at high speeds you can't turn because the coordinates skip past
      if (!game.math.fuzzyEqual(cx, turnPoint.x, threshold) || !game.math.fuzzyEqual(cy, turnPoint.y, threshold)){
                return false;
      }
      //  Grid align before turning
      ship.x = turnPoint.x;
      ship.y = turnPoint.y;
      ship.body.reset(turnPoint.x, turnPoint.y);
      move(turning);
      turning = Phaser.NONE;
      return true;
    }

    function move(direction){
      var speed = 120;
      if (direction === Phaser.LEFT || direction === Phaser.UP){
        speed = -speed;
      }
      if (direction === Phaser.LEFT || direction === Phaser.RIGHT){
        ship.body.velocity.x = speed;
      }
      else{
        ship.body.velocity.y = speed;
      }
      ship.angle = -90;
      if (direction === Phaser.LEFT)
      {
          ship.angle = 90;
      }
      else if (direction === Phaser.UP)
      {
          ship.angle = 180;
      }
      else if (direction === Phaser.DOWN)
      {
          ship.angle = 0;
      }
      currentDirection = direction;

    }

    function updateFogOfWar () {
    var gradient = bmd.context.createRadialGradient(
        fogOfWar.x - game.camera.x,
        fogOfWar.y - game.camera.y,
        fogOfWar.radius,
        fogOfWar.x - game.camera.x,
        fogOfWar.y - game.camera.y,
        fogOfWar.radius - fringe
    );

      gradient.addColorStop(0, 'rgba(0,0,0,1');
      gradient.addColorStop(0.4, 'rgba(0,0,0,0.5');
      gradient.addColorStop(1, 'rgba(0,0,0,0');

      bmd.clear();
      bmd.context.fillStyle = gradient;
      bmd.context.fillRect(0, 0, 800, 600);
    }

    function render() {

    // Sprite debug info
    game.debug.text("Find all 3 of your lost men,", 32, 32);
    game.debug.text("then make it to the bottom right to escape!", 32, 48);

    }

    function hitMan(body1, body2){
      body2.kill();
      menFound += 1;
      hooray = game.add.audio('hooray');
      hooray.play();
    }


    return {

        create: function () {
          game.world.setBounds(0,0,1440,1888);
          game.physics.startSystem(Phaser.Physics.ARCADE);
          map = game.add.tilemap('maze');
          map.addTilesetImage('tiles', 'tiles');
          map.fixedToCamera = true;

          music = game.add.audio('gameMusic');
          music.loop = true;
          music.play();

          layer = map.createLayer('Tile Layer 1');
          //layer.scale.set(.5);
          layer.resizeWorld();

          map.setCollision(20, true, layer);
          map.setCollision(19, true, layer);
          map.setCollision(18, true, layer);
          map.setCollision(17, true, layer);
          ship = game.add.sprite(48,48,'ship');
          ship.anchor.set(0.5,0.5);
          game.physics.enable(ship, Phaser.Physics.ARCADE);
          game.camera.follow(ship);
          //menFoundString = 'Men Found: ';
          //menFoundText = game.add.text(1250, 1856, menFoundString + menFound, { font: '30px Gothic', fill: '#495' });
          //menFoundText.fixedToCamera = true;

          lostMen = game.add.group();
          lostMen.enableBody = true;
          lostMen.physicsBodyType = Phaser.Physics.ARCADE;
          lostMen.create(1376, 32, 'man');
          lostMen.create(32, 1312, 'man');
          lostMen.create(1376, 1504, 'man');

          cursors = game.input.keyboard.createCursorKeys();


          fogOfWar = new Phaser.Circle(300,300,300);
          fringe = 64;
          bmd = game.make.bitmapData(800,600);
          updateFogOfWar();
          var fogSprite = bmd.addToWorld();
          fogSprite.fixedToCamera = true;

        },

        update: function () {
          render();
          if(ship.x >= 1376 && ship.y >= 1822 && menFound == 3){
            //music.stop();
            menFound=0;
            endGame(1);
          }
          fogOfWar.x = ship.x;
          fogOfWar.y = ship.y;

          updateFogOfWar();
          game.physics.arcade.collide(ship,layer);
          game.physics.arcade.collide(lostMen, ship, null, hitMan, this);

          marker.x = game.math.snapToFloor(Math.floor(ship.x), 32) / 32;
          marker.y = game.math.snapToFloor(Math.floor(ship.y), 32) / 32;

          var i = layer.index;
          var x = marker.x;
          var y = marker.y;

          directions[1] = map.getTileLeft(layer.index, marker.x, marker.y);
          directions[2] = map.getTileRight(layer.index, marker.x, marker.y);
          directions[3] = map.getTileAbove(layer.index, marker.x, marker.y);
          directions[4] = map.getTileBelow(layer.index, marker.x, marker.y);

          checkKeys();

          if(turning != Phaser.NONE){
            turn();
          }
        }
    };
};
