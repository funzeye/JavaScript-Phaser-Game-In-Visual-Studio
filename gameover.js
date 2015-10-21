GameStates.GameOver = function (game) {

}
 
GameStates.GameOver.prototype = {
    //init: function(score){
    //    alert("You scored: "+score)
    //},
    create: function(){
        font = this.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET6, 10, 1, 1);
        font.text = "Game Over";

        fontImage = this.add.image(this.world.centerX, this.world.centerY, font);
        fontImage.anchor.set(0.5);

        var loadingText = this.add.text(this.game.width / 2, this.game.height / 2 + 80, "Play Again? Press Enter...", { font: "20px monospace", fill: "#fff" });
        loadingText.anchor.setTo(0.5, 0.5);
        loadingText.alpha = 0.1;
        this.add.tween(loadingText).to({ alpha: 1 }, 2000, "Linear", true);

        this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        this.enterKey.onDown.add(this.playGame, this);
    },
    playGame: function(){
        this.state.start("Level1");
    }
}