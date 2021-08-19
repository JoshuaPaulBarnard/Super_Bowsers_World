var BowsersWorld = BowsersWorld || {};

//loading the game assets
BowsersWorld.Preload = function(){};

BowsersWorld.Preload.prototype = {
  preload: function() {
  	//show loading screen
  	this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.splash.anchor.setTo(0.5);

    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

  	//load game assets
    this.load.tilemap('SMB_Map', 'assets/tilemaps/maps/super_mario_bros.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.bitmapFont('SMW_Font', 'assets/font/Super_Mario_World.png', 'assets/font/Super_Mario_World.fnt');
    this.load.image('titleScreen', 'assets/images/Title_Screen.png');
    this.load.image('tiles', 'assets/tilemaps/tiles/super_mario_bros.png');
		this.load.image('coin', 'assets/sprites/coin_sprite.png');
    this.load.image('world_1-1', 'assets/images/world_1-1.png');
    this.load.spritesheet('fireWorks', 'assets/sprites/fireWorks.png', 32, 32);
    this.load.spritesheet('bowserFlame', 'assets/sprites/bowserFlames.png',57 ,16);
    this.load.spritesheet('CoinCounter', 'assets/sprites/coinCounter.png', 20, 25);
    this.load.spritesheet('bowserLarge', 'assets/sprites/bowser_sprite_large.png', 32, 64);
    this.load.spritesheet('marioLarge', 'assets/sprites/mario_sprite.png', 42, 64);
    this.load.spritesheet('luigiLarge', 'assets/sprites/luigi_sprite.png', 38, 64);
		this.load.audio('music', 'assets/audio/Super_Mario_Bros_music_01.mp3');
		this.load.audio('jumpSFX', 'assets/audio/smb_jump-super.wav');
		this.load.audio('coinSFX', 'assets/audio/smb_coin.wav');
		this.load.audio('fallSFX', 'assets/audio/smb_bowserfalls.wav');
		this.load.audio('brickSFX', 'assets/audio/smb_breakblock.wav');
		this.load.audio('exitSFX', 'assets/audio/smb_stage_clear.wav');
		this.load.audio('hurryMusic', 'assets/audio/Super_Mario_Bros_hurryMusic.mp3');
		this.load.audio('deathSFX', 'assets/audio/smb_mariodie.wav');
    this.load.audio('flameSFX', 'assets/audio/smb_bowserfire.wav');
    this.load.audio('thwompSFX', 'assets/audio/Thwomp.wav');
  },

  create: function() {
  	this.state.start('MainMenu');
  }
};
