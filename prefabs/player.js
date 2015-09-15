//http://www.html5gamedevs.com/topic/4111-multi-file-game/
//http://www.codevinsky.com/phaser-2-0-tutorial-flappy-bird-part-2/

var lives;
var playerLives = 3;
var hurtSFX;
var cursors;
var jumpButton;
var jumpTimer = 0;


var Player = function (game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key, frame);
    this.game.physics.arcade.enableBody(this);
    this.scale.setTo(1.1, 1.1);
    this.body.collideWorldBounds = true;
    this.body.setSize(20, 32, 0, 0);
    this.anchor.setTo(.5, 1); //so it flips around its middle
    this.animations.add('move', [5, 6, 7, 8], 10, true);

    cursors = this.game.input.keyboard.createCursorKeys();
    jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function () {
    if (cursors.left.isDown) {
        this.scale.x = -1;
        this.body.velocity.x = -150;
        this.animations.play('move');
    }
    else if (cursors.right.isDown) {
        this.scale.x = 1;
        this.body.velocity.x = 150;
        this.animations.play('move');
    }
    else {
        this.animations.stop();
        this.frame = 5;
    }

    if (jumpButton.isDown && this.body.onFloor() && this.game.time.now > jumpTimer) {
        jumpSFX.play();
        this.body.velocity.y = -250;
        jumpTimer = this.game.time.now + 250;
    }
};

Player.prototype.setupPlayerLives = function ()
{
    lives = this.game.add.group();
    // calculate location of first life icon
    var firstLifeIconX = 64;
    for (var i = 0; i < playerLives; i++) {
        var life = lives.create(firstLifeIconX + (30 * i), 30, 'dude');
        life.scale.setTo(0.5, 0.5);
        life.anchor.setTo(0.5, 0.5);
    }
};

Player.prototype.playerHit = function () {
    var life = lives.getFirstAlive();
    if (life !== null) {
        hurtSFX.play();
        life.kill();
        this.kill();
        return true;
    } else {
        this.kill();
        return false;
    }
};