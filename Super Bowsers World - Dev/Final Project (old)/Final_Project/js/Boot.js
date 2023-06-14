var BowsersWorld = BowsersWorld || {};

BowsersWorld.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
BowsersWorld.Boot.prototype = {
  preload: function() {
  	//assets we'll use in the loading screen
    this.load.image('logo', 'assets/images/my_logo.png');
    this.load.image('preloadbar', 'assets/images/loading_bar.png');
  },
  create: function() {
  	//loading screen will have a light blue background
    this.game.stage.backgroundColor = '#6888ff';

	//have the game centered horizontally
	this.scale.pageAlignHorizontally = true;

	//physics system for movement
	this.game.physics.startSystem(Phaser.Physics.ARCADE);

  this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

  this.state.start('Preload');
  }
};
