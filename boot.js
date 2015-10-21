var GameStates = {}; //declare the object that will hold all game states

GameStates.Boot = function (game) {  //declare the boot state

};

GameStates.Boot.prototype = {
    preload: function () {
        // load preloader assets e.g. for loading screen / splashscreen
        this.load.image('loading', 'assets/loading.png');
    },
    create: function () {
        // setup game environment
        // scale, input etc..

        //call next state
        this.state.start('Preloader');
    }
};
