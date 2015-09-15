var map;
var bg;
var backgroundLayer;
var blockLayer;
var player;
var skeleton;
var treasure;
var treasureCollected = false;
var currentDir = "right";
var enemySpeed = 40;
var music;
var starCollideSFX;
var jumpSFX;
var ray;
var tileHits = [];

GameStates.Level1 = function (game) {
};

GameStates.Level1.prototype = {

    create: function () {

        map = this.add.tilemap('myTilemap');
        map.addTilesetImage('scifi_platformTiles_32x32', 'myTileset');

        bg = this.add.tileSprite(0, 0, 640, 640, 'bg');
        //bg.fixedToCamera = true;

        backgroundLayer = map.createLayer('background');
        blockLayer = map.createLayer('blocklayer');
        backgroundLayer.resizeWorld();

        //collision on blockedLayer
        //setCollisionBetween(start, stop, collides, layer, recalculate)
        map.setCollisionBetween(781, 786, true, 'blocklayer');
        map.setCollisionBetween(463, 464, true, 'blocklayer');
        map.setCollision(779, true, 'blocklayer');

        this.physics.arcade.gravity.y = 300;

        // Create a new player object
        player = new Player(this.game, 50, 32, 'dude');
        player.setupPlayerLives();
        // and add it to the game
        this.add.existing(player);

        this.setupEnemy();
        this.setupTreasure();
        //this.camera.follow(player);

        //play music
        //this.playBackgroundMusic();
        this.playSoundEffects();

    },


    playSoundEffects: function(){
        starCollideSFX = this.add.audio('star-collide');
        jumpSFX = this.add.audio('jump',0.2);
        hurtSFX = this.add.audio('hurt');
    },

    playBackgroundMusic: function(){
        music = this.add.audio('grey_sector', 0.2);
        music.play();
    },

    setupTreasure: function () {
        treasure = this.add.sprite(565, 550, 'treasure');
        this.physics.enable(treasure, Phaser.Physics.ARCADE);
    },

    setupEnemy: function () {
        skeleton = this.add.sprite(400, 400, 'skeleton'); //400 x 400 = starting position
        this.physics.enable(skeleton, Phaser.Physics.ARCADE);
        skeleton.body.collideWorldBounds = true;
        skeleton.body.setSize(16, 40, 0, -3);
        skeleton.anchor.setTo(.5, 1); //so it flips around its middle
        skeleton.animations.add('move-enemy-right', [148, 149, 150, 151], 10, true);
        skeleton.animations.add('move-enemy-left', [118, 119, 120, 121], 10, true);
        skeleton.animations.play('move-enemy-right', 10, true); // get enemy moving
        //skeleton
    },

    moveSkeleton: function () {
        skeleton.body.velocity.x = enemySpeed;
    },

    checkForCliff: function (side) {
        var offsetX; //check tile ahead of sprite as opposed to right under
        if (side == "left") {
            offsetX = -3;
        } else if (side == "right") {
            offsetX = 23;
        }

        var tile = map.getTileWorldXY(skeleton.body.x + offsetX, skeleton.body.y + 48, 32, 32, blockLayer);

        if (skeleton.body.onFloor() && tile == null) {
            return true;
        } else {
            return false;
        }
    },

    update: function () {

        this.physics.arcade.collide(treasure, blockLayer);

        this.physics.arcade.collide(player, blockLayer);

        this.physics.arcade.collide(skeleton, blockLayer, this.moveSkeleton);

        ray = new Phaser.Line(skeleton.x, skeleton.y - 40, player.x, player.y - 40);
        //check if a wall is obstructing the view
        //if not being obstructed increase speed of enemy.
        // Test if any walls intersect the ray
        var intersect = this.getWallIntersection(ray);

        if (intersect) {
            // A wall is blocking their vision so change them to normal speed
            skeleton.body.velocity.x = enemySpeed;
        } else {
            // Enemy can see Player so change them to faster speed
            skeleton.body.velocity.x = enemySpeed * 2;
        }

        player.body.velocity.x = 0;

        if (skeleton.body.blocked.right == true && currentDir == "right") {
            //player.x = 12;
            enemySpeed *= -1;
            currentDir = "left";
            skeleton.animations.play('move-enemy-left');
        }
        else if (skeleton.body.blocked.left == true && currentDir == "left") {
            //player.x = 12;
            enemySpeed *= -1;
            currentDir = "right";
            skeleton.animations.play('move-enemy-right');
        }
        else if (this.checkForCliff(currentDir) == true) {
            enemySpeed *= -1;
            if (currentDir == "right") {
                currentDir = "left";
                skeleton.animations.play('move-enemy-left');
            }
            else {
                currentDir = "right";
                skeleton.animations.play('move-enemy-right');
            }
        }

        //player death
        this.physics.arcade.overlap(player, skeleton, this.playerHit, null, this);

        //treasure collected
        this.physics.arcade.overlap(player, treasure, this.treasureCollect, null, this);

        if (treasureCollected && player.position.x > map.widthInPixels) {
            //end level here
            this.state.start('Level2');
        }
    },

    getWallIntersection: function (ray) {

        tileHits = blockLayer.getRayCastTiles(ray, 4, true, false); //getRayCastTiles(line, stepRate, collides, interestingFace)

        if (tileHits.length > 0) {
            //  Just so we can visually see the tiles being hit by the ray
            //for (var i = 0; i < tileHits.length; i++) {
            //    tileHits[i].debug = true;
            //}
            //blockLayer.dirty = true;
            return true;
        }
        return false;
    },

    playerHit: function () {
        var respawn = player.playerHit();
        if (respawn == true) {
            //hurtSFX.play();
            //this.setupPlayer();
            player = new Player(this.game, 50, 32, 'dude');
            this.add.existing(player);
        } else {
            //player.kill();
            this.gameOver();
        }
    },

    gameOver: function () {
        var message = "Game Over!";
        var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
        this.endText = this.add.text(this.width / 2, this.height / 2 - 60, message, style);
        this.endText.anchor.setTo(0.5, 0);
        this.state.start('MainMenu');
    },

    treasureCollect: function () {
        treasure.kill();
        starCollideSFX.play();
        treasureCollected = true;
        player.body.collideWorldBounds = false;
    },

    render: function () {
        //this.debug.soundInfo(jumpSFX, 32, 32);
        //this.debug.text(this.time.physicsElapsed, 32, 32);
        //this.debug.body(player);
        //this.game.debug.body(skeleton);
        //this.game.debug.bodyInfo(skeleton, 16, 24);
        //this.game.debug.geom(ray);
    }
};