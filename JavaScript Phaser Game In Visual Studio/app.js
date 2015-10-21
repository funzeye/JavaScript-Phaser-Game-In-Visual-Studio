window.onload = function() {

    var game = new Phaser.Game(640, 640, Phaser.AUTO, 'phaser-example');

    game.state.add('Boot', GameStates.Boot);
    game.state.add('Preloader', GameStates.Preloader);
    game.state.add('MainMenu', GameStates.MainMenu);
    game.state.add('Level1', GameStates.Level1);
    game.state.add('Level2', GameStates.Level2);
    game.state.add("GameOver", GameStates.GameOver);

    //game.player = new game.Player(game);

    //  Now start the Boot state.
    game.state.start('Boot');

};