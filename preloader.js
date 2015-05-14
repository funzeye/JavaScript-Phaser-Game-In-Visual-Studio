GameStates.Preloader = function (game) {

}

GameStates.Preloader.prototype = {
    preload: function () {
        // load all game assets
        // images, spritesheets, atlases, audio etc..
        this.load.tilemap('myTilemap', 'assets/tilemaps/scifi.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('myTileset', "assets/tilemaps/scifi_platformTiles_32x32.png");
        this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        this.load.spritesheet('skeleton', 'assets/skeleton_3.png', 64, 64);
        this.load.image('bg', 'assets/scifi_platform_BG1.jpg');
        this.load.image('treasure', 'assets/star2.png');
    },
    create: function () {
        //call next state - change this to MainMenu when development complete
        this.state.start('Level1');
    }
};