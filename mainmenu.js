
GameStates.MainMenu = function (game) {

    this.music = null;
    this.playButton = null;

};

var distance = 300;
var speed = 6;
var max = 500;

var canvas;

var xx = [];
var yy = [];
var zz = [];

var font;
var fontImage;


GameStates.MainMenu.prototype = {
    create: function () {

        //create star background bitmap
        canvas = this.add.bitmapData(640, 640);
        canvas.addToWorld();

        for (var i = 0; i < max; i++) {
            xx[i] = Math.floor(Math.random() * 600) - 300;
            yy[i] = Math.floor(Math.random() * 600) - 300;
            zz[i] = Math.floor(Math.random() * 1700) - 100;
        }

        //create main menu text and images - create a "Start Game" mechanism
        font = this.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET6, 10, 1, 1);
        font.text = "Terraform";

        fontImage = this.add.image(this.world.centerX, this.world.centerY, font);
        fontImage.anchor.set(0.5);
        //fontImage.tint = 0xFFFFFF;
        this.add.tween(fontImage).from({ y: -200 }, 2000, Phaser.Easing.Bounce.Out, true);

        //var style = { font: "75px ariel", fill: "#ff0044", align: "center" };
        //var text = this.add.text(this.world.centerX, this.world.centerY, "Terraform", style);
        //text.anchor.set(0.5, 1);
        //text.alpha = 0.1;
        //this.add.tween(text).to({ alpha: 1 }, 2000, "Linear", true);


        var loadingText = this.add.text(this.game.width / 2, this.game.height / 2 + 80, "Press Enter to start", { font: "20px monospace", fill: "#fff" });
        loadingText.anchor.setTo(0.5, 0.5);
        loadingText.alpha = 0.1;
        this.add.tween(loadingText).to({ alpha: 1 }, 2000, "Linear", true);

        this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        this.enterKey.onDown.add(this.playGame, this);
    },

    update: function () {

        canvas.clear();

        for (var i = 0; i < max; i++) {
            var perspective = distance / (distance - zz[i]);
            var x = this.world.centerX + xx[i] * perspective;
            var y = this.world.centerY + yy[i] * perspective;

            zz[i] += speed;

            if (zz[i] > 300) {
                zz[i] -= 600;
            }

            //  Swap this for a standard drawImage call
            canvas.draw('starwipe', x, y);
        }
    },

    playGame: function () {
            this.state.start('Level1');
    }
};