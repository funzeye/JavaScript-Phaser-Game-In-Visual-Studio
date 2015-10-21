GameStates.Preloader = function (game) {

}

GameStates.Preloader.prototype = {
    preload: function () {

        // loading bar on splashscreen - start

        var loadingBar = this.add.sprite(this.world.centerX, this.world.centerY, "loading");
        loadingBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(loadingBar);

        // loading bar on splashscreen - end

        // load all game assets
        // images, spritesheets, atlases, audio etc..

        // assets for main menu screen
        this.load.image('starwipe', 'assets/demoscene/star2.png');
        this.load.image('knightHawks', 'assets/fonts/retroFonts/KNIGHT3.png');
        //

        this.load.tilemap('myTilemap', 'assets/tilemaps/scifi.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('myTileset', "assets/tilemaps/scifi_platformTiles_32x32.png");
        this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        this.load.spritesheet('skeleton', 'assets/skeleton_3.png', 64, 64);
        this.load.image('bg', 'assets/scifi_platform_BG1.jpg');
        this.load.image('treasure', 'assets/star2.png');

        //  Firefox doesn't support mp3 files, so use ogg
        // credit: FoxSynergy - http://opengameart.org/content/grey-sector-8-bit
        this.load.audio('grey_sector', ['assets/music/Grey Sector v0_86_0.mp3', 'assets/music/Grey_Sector_v0_86_0.ogg']);

        //sound effects
        // credit: http://opengameart.org/content/picked-coin-echo
        /// use http://www.online-convert.com/ to get alternate formats
        this.load.audio('star-collide', ['assets/sound-effects/Picked_Coin_Echo.ogg', 'assets/sound-effects/Picked_Coin_Echo.m4a']);
        // credit: http://opengameart.org/content/platformer-jumping-sounds
        this.load.audio('jump', ['assets/sound-effects/jump.ogg', 'assets/sound-effects/jump.m4a']);
        // credit: http://opengameart.org/content/platform-small-sound-effect-pack
        this.load.audio('hurt', ['assets/sound-effects/Hurt.ogg', 'assets/sound-effects/Hurt.m4a']);


    },
    create: function () {
        //call next state - change this to MainMenu when development complete
        this.state.start('MainMenu');
    }
};