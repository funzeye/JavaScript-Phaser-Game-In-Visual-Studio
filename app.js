var game = new Phaser.Game(640, 640, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.tilemap('myTilemap', 'assets/tilemaps/scifi.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('myTileset', "assets/tilemaps/scifi_platformTiles_32x32.png");
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('skeleton', 'assets/skeleton_3.png', 64, 64);
    game.load.image('bg', 'assets/scifi_platform_BG1.jpg');
}

var map;
var bg;
var layer;
var layer2;
var player;
var skeleton;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var tile = null;
var currentDir = "right";
var enemySpeed = 40;

function create() {
    map = game.add.tilemap('myTilemap');
    map.addTilesetImage('scifi_platformTiles_32x32', 'myTileset');

    bg = game.add.tileSprite(0, 0, 640, 640, 'bg');
    bg.fixedToCamera = true;

    layer = map.createLayer('background');
    layer2 = map.createLayer('blocklayer');
    //layer.resizeWorld();

    //collision on blockedLayer
    //setCollisionBetween(start, stop, collides, layer, recalculate)
    map.setCollisionBetween(781, 786, true, 'blocklayer');
    map.setCollisionBetween(463, 464, true, 'blocklayer');
    map.setCollision(779, true, 'blocklayer');

    setupPlayer();
    setupEnemy();
    //game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function setupPlayer()
{
    player = game.add.sprite(50, 32, 'dude'); //50 x 32 = starting position
    game.physics.enable(player, Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 300;
    player.body.bounce.y = 0.2;
    player.scale.setTo(1.1, 1.1);
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 0, 0);
    player.anchor.setTo(.5, 1); //so it flips around its middle
    player.animations.add('move', [5, 6, 7, 8], 10, true);
}

function setupEnemy() {
    skeleton = game.add.sprite(400, 400, 'skeleton'); //50 x 32 = starting position
    game.physics.enable(skeleton, Phaser.Physics.ARCADE);
    skeleton.body.collideWorldBounds = true;
    skeleton.body.setSize(16, 40, 0, -3);
    skeleton.anchor.setTo(.5, 1); //so it flips around its middle
    skeleton.animations.add('move-enemy-right', [148, 149, 150, 151], 10, true);
    skeleton.animations.add('move-enemy-left', [118, 119, 120, 121], 10, true);
    skeleton.animations.play('move-enemy-right', 10, true); // get enemy moving
    //skeleton
}



function moveSkeleton() {
    skeleton.body.velocity.x = enemySpeed;
}

function checkForCliff(side) {
    var offsetX; //check tile ahead of sprite as opposed to right under
    if (side == "left") {
        offsetX = -3;
    } else if (side == "right") {
        offsetX = 23;
    }

    tile = map.getTileWorldXY(skeleton.body.x + offsetX, skeleton.body.y + 48, 32, 32, layer2);

    if (skeleton.body.onFloor() && tile == null) {
        return true;
    } else {
        return false;
    }
}

function update() {

    game.physics.arcade.collide(player, layer2);

    skeleton.body.velocity.x = 0;
    game.physics.arcade.collide(skeleton, layer2, moveSkeleton);

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
    else if (checkForCliff(currentDir) == true) {
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

    if (cursors.left.isDown) {
        player.scale.x = -1;
        player.body.velocity.x = -150;

        if (facing != 'left') {
            player.animations.play('move');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown) {
        player.scale.x = 1;
        player.body.velocity.x = 150;

        if (facing != 'right') {
            player.animations.play('move');
            facing = 'right';
        }
    }
    else {
        if (facing != 'idle') {
            player.animations.stop();

            if (facing == 'move') {
                player.frame = 0;
            }
            else {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }

    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }

    //player death
    game.physics.arcade.overlap(player, skeleton, playerHit);
}

function playerHit() {
    player.kill();
    setupPlayer();
}

function render() {
    //game.debug.text(game.time.physicsElapsed, 32, 32);
    //game.debug.body(player);
    //game.debug.body(skeleton);
    //game.debug.bodyInfo(skeleton, 16, 24);
}