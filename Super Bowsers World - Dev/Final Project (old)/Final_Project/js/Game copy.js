var BowsersWorld = BowsersWorld || {};

//title screen
BowsersWorld.Game = function(){};

BowsersWorld.Game.prototype = {

  create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.map;
      this.tileset;
      this.layer;
      this.cursors;
      this.coins;
      this.player1Coins = 0;
      this.timer;
      this.timer2;
      this.timerTotal;
      this.timer2Total;
      this.player1Score = 0;
      this.flames;
      this.flamesTime = 0;

  		// Create the game timer
      this.timerTotal = 150;
  		this.timer = this.game.time.create(false);
  		this.timer.loop(1000, this.timerUpdate, this);
  		this.timer.start();

      // Create miscellaneous timer for events
      this.timer2Total = 150;
      this.timer2 = this.game.time.create(false);
      this.timer2.loop(1000, this.timer2Update, this);
      this.timer2.start();

  		// Generate the map
  		this.game.stage.backgroundColor = '#6888ff';
      this.map = this.game.add.tilemap('SMB_Map');
      this.map.addTilesetImage('1 - 1', 'tiles');
  		this.layer = this.map.createLayer('World1-1');
  		this.layer.resizeWorld();
  		this.map.setLayer(this.layer);
      this.statusBar(this);

  		// Set Tile Collisions
      //  14 = ? block, 15 = brick, 11 = coins, {5,10,13,17}=Flag Pole, 33,39 = door
  		//map.setCollision(5);
  		//map.setCollisionBetween(10, 11);
      //map.setCollisionBetween(13, 17);
  		this.map.setCollisionBetween(14,16);
  		//map.setCollision(16);
      //map.setCollisionBetween(20, 25);
  		this.map.setCollisionBetween(21,22);
      //map.setCollisionBetween(27, 29);
  		this.map.setCollisionBetween(27,28);
  		//map.setCollision(40);
  		this.map.setCollisionBetween(39,40);


  		//map.setTileIndexCallback(15, breakBrick, this);
  		//map.setCollisionByExclusion([14, 15], true, layer);

  		//  This will set Tile ID 26 (the coin) to call the hitCoin function when collided with
  		//map.setTileIndexCallback(14, breakQBlock, this);
  		//  This will set the map location 2, 0 to call the function
  		//map.setTileLocationCallback(2, 0, 1, 1, breakQBlock, this);

  		this.map.setTileIndexCallback(39, this.exitDoor, this);

      //  This will set the map location 2, 0 to call the function
      //map.setTileLocationCallback(2, 0, 1, 1, fallDownHole, this);


  		// Debug for seeing collisions
  		// layer.debug = true;

  		// Create the players sprite and its parameters
      this.player = this.game.add.sprite(160, 175, 'bowser');
      this.game.physics.arcade.enable(this.player);
  		this.game.camera.follow(this.player);
      this.player.body.collideWorldBounds = true;
  		this.player.body.gravity.y = 6000;
      this.player.animations.add('left', [0, 1, 2, 3], 10, true);
      this.player.animations.add('right', [5, 6, 7, 8], 10, true);

  		// World physics
  		this.game.physics.arcade.gravity.y = 000;
  		this.game.physics.arcade.TILE_BIAS = 32;
  		this.game.physics.arcade.checkCollision.down = false;
  		this.game.physics.arcade.checkCollision.up = false;

      //  Create Coins group to collect with physics
      this.coins = this.game.add.group();
      this.coins.enableBody = true;

  		// Create Coins across the map with slight variance each time.
  		for (var i = 1; i < 21; i++)
      {
          //  Create a coin inside of the 'coins' group
          var coin = this.coins.create( i * (600+15*Math.random()), 0, 'coin');
          //  Sets coins gravity
          coin.body.gravity.y = 4000;
      }

      //map.createFromObjects('World1-1', 14, 'coins', null, true, false, coins);

      // Create flames group for player to shoot
      this.flames = this.game.add.group();
      this.flames.enableBody = true;
      /*
      //this.flames.physicsBodyType = Phaser.Physics.ARCADE;
      for (var i = 0; i < 20; i++)
      {
          var flame = this.flames.create(0, 0, 'bowsersFlame');
          flame.name = 'bowsersFlame' + i;
          flame.exists = true;
          //flame.visible = false;
          flame.checkWorldBounds = true;
          flame.collideWorldBounds = false;
          //flame.events.onOutOfBounds.add(resetFlame, this);
      }
*/
/*
      // Create Enemies group
      enemies = game.add.group();
      enemies.enableBody = true;
      //enemies.physicsBodyType = Phaser.Physics.ARCADE;
      for (var i = 0; i < 50; i++)
      {
          var enemy = enemies.create(game.world.randomX, Math.random() * 500, 'marioEnemies', game.rnd.integerInRange(0, 36));
          c.name = 'Enemy' + i;
          //c.body.immovable = true;
      }
*/

  		// Breakable Bricks
  		//this.QBlock = this.game.add.group();
  		//this.QBlock.enableBody = true;

  		// Breakable ?-Blocks
  		//brick = game.add.group();
  		//brick.enableBody = true;

  		// Exit Door
  		//door = game.add.group();
  		//door.enableBody = true;

  		// Falling down a hole
  		//fall = game.add.group();
  		//fall.enableBody = true;

  		// Input
      this.cursors = this.game.input.keyboard.createCursorKeys();
  		this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  		this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  		this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  		this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  		this.game.input.keyboard.addKey(Phaser.Keyboard.D);
  		this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

  		// Mouse Click = Full Screen
  		this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
  		this.game.input.onDown.add(this.goFull, this);

  		// Sounds
  		this.music = this.game.add.audio('music');
  		this.music.play();
  		this.hurryMusic = this.game.add.audio('hurryMusic');
  		this.jumpSFX = this.game.add.audio('jumpSFX');
  		this.coinSFX = this.game.add.audio('coinSFX');
  		this.fallSFX = this.game.add.audio('fallSFX');
  		this.brickSFX = this.game.add.audio('brickSFX');
  		this.exitSFX = this.game.add.audio('exitSFX');
  		this.deathSFX = this.game.add.audio('deathSFX');
  },

  update: function() {
  	  this.player.body.velocity.x = 0;

  		this.game.physics.arcade.collide(this.player, this.layer);
      this.game.physics.arcade.collide(this.coins, this.layer);
      //  As we don't need to exchange any velocities or motion we can the 'overlap' check instead of 'collide'
      this.game.physics.arcade.overlap(this.flames, this.enemy, this.flameCollisionHandler, null, this);
  		//game.physics.arcade.collide(brick, layer);

  		//  Checks to see if the player overlaps with any of the coins and calls the collectCoin function
  		this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);

  		//
  		//game.physics.arcade.overlap(player, brick, breakBrick, null, this);

  		//
  		//game.physics.arcade.overlap(player, QBlock, breakQBlock, null, this);

  		//
  		//game.physics.arcade.overlap(player, door, exitDoor, null, this);

  		// Out of Bounds
  		this.player.events.onOutOfBounds.add(this.fallDownHole, this);

  		// Controls
  		if (this.cursors.left.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.A))
  	    {
  	        //  Move to the left
  					this.player.checkWorldBounds = true;
  					this.player.body.velocity.x = -250;
  	        this.player.animations.play('left');
  	    }
      else if (this.cursors.right.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.D))
  	    {
  	        //  Move to the right
  					this.player.checkWorldBounds = true;
  					this.player.body.velocity.x = 250;
  	        this.player.animations.play('right');
  	    }
  		else if (this.cursors.down.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.S))
  			{
  				this.player.checkWorldBounds = true;
          breathFire();
  			}
  		else
  		   {
  	     		//  Stand still
  	       this.player.animations.stop();
  	       this.player.frame = 4;
  		   }
  		if (this.cursors.up.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.W) || this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
  	 		{
  					this.player.checkWorldBounds = true;
  	 				if (this.player.body.onFloor())
  	 				{
  	 					this.player.body.velocity.y = -1350;
  	 					this.jumpSFX.play();
  	 				}
  	 		}

  },

/*
  throwSomething: function() {

      // has it been long enough? can we throw something yet?
      if (game.time.now > nextFire) {

          nextFire = game.time.now + FIRE_RATE;

          // see if a weapon is available from the group
          var weapon = weapons[weaponIndex].sprites.getFirstExists(false);
          if (weapon) {

              weapon.exists = true;
              weapon.anchor.setTo(0.5, 0.5);
              weapon.reset(frog.body.position.x+20, frog.body.position.y-20);
              game.physics.arcade.enable(weapon);

              weapon.lifespan = weapons[weaponIndex].lifespan;
              weapon.body.angularVelocity = weapons[weaponIndex].spin;
              weapon.body.velocity.y = weapons[weaponIndex].velocity.y;
              weapon.power = weapons[weaponIndex].power;
              if (frog.scale.x == 1) {
                  weapon.body.velocity.x = weapons[weaponIndex].velocity.x;
              } else{
                  weapon.body.velocity.x = -weapons[weaponIndex].velocity.x;
              }
          }
      }
  }
  */

  breathFire: function()
  {
    if (this.game.time.now > this.flamesTime)
    {
        bowserFlame = flames.getFirstExists(false);

        if (bowserFlame)
        {
            this.bowserFlame.reset(this.sprite.x + 6, this.sprite.y - 8);
            this.bowserFlame.body.velocity.x = 300;
            this.flamesTime = this.game.time.now + 150;
        }
    }
  },

/*
  //  Called if the flame goes out of the screen
  resetFlame: function(this.flame)
  {
      this.flame.kill();
  },
*/

/*
  //  Called if the bullet hits one of the veg sprites
  flameCollisionHandler: function(this.flame, this.enemy)
  {
      this.flame.kill();
      this.enemy.kill();
  },
*/

  collectCoin: function(player, coin)
  {
  		// Plays coin sound
  		this.coinSFX.play();
      // Removes the coin from the screen
      coin.kill();
      //  Add and update the score
      this.player1Score += 200;
  		this.player1Coins += 1;
  },

  breakBrick: function(player, brick)
  {
  	// Plays breakbrick Sound
  	this.brickSFX.play();
  	// Removes brick
  	//brick.kill();
  	//map.swap(1,15)
  },

  breakQBlock: function()
  {
  	// Plays breakbrick Sound
  	this.brickSFX.play();
  	// Removes ?-Blocks
  	this.map.removeTileWorldXY(x, y, this.tile.width, tile.height, this.blockedLayer);
  	this.map.putTileWorldXY(42, x, y, this.tile.width, tile.height, this.blockedLayer);
  },

  exitDoor: function()
  {
  	// Pause Music and play ending music
  	this.music.stop();
  	this.hurryMusic.stop();
  	this.exitSFX.play();
  	// stop timer
  	this.timer.stop();
  	// add remaining time to score
  	this.player1Score = this.player1Score + (this.timerTotal * 100);
  	this.timerTotal = 0;
    // Removes Player's Sprite and returns to main menu
  	this.player.kill();
    this.timer2Total = 7;
  },

  fallDownHole: function()
  {
  	this.timer.stop();
  	this.music.stop();
  	this.hurryMusic.stop();
  	this.fallSFX.play();
  	this.timerTotal = 0;
    this.timer.stop();
    // Kills Player and returns to main menu
    this.player.kill();
    this.timer2Total = 1;
  },

  gameOver: function()
  {
  	this.timer.stop();
  	this.music.stop();
  	this.hurryMusic.stop();
  	this.deathSFX.play();
  	this.timerTotal = 0;
    this.timer.stop();

  	//make the player explode
  	var emitter = this.game.add.emitter(this.player.x, this.player.y, 7);
  	emitter.makeParticles('deathFlames');
  	emitter.minParticleSpeed.setTo(-500, -500);
  	emitter.maxParticleSpeed.setTo(500, 500);
  	emitter.gravity = 0;
  	emitter.start(true, 2000, null, 7);

    // Kills Player and returns to main menu
    this.player.kill();
    this.timer2Total = 4;
  },

  timerUpdate: function()
  {
  		this.timerTotal -= 1;
  		// Plays Hurry Up Music when timer reaches 45seconds
  		if (this.timerTotal == 43)
  		{
  			this.music.stop();
  			this.hurryMusic.play();
  		}
  		// Kills player if time runs out
  		if (this.timerTotal == 0)
  		{
  			this.gameOver();
  		}
  },

  timer2Update: function()
  {
      this.timer2Total -= 1;
      if(this.timer2Total == 0)
      {
        this.game.state.start('MainMenu', true, false, this.player1Score);
      }
  },

  goFull: function()
  {
      if (this.game.scale.isFullScreen)
  		{
          this.game.scale.stopFullScreen();
      }
  		else
  		{
          this.game.scale.startFullScreen(false);
      }
  },

  // Create Top Status Bar
  statusBar: function()
  {
  var status1_1 = "BOWSER";
  var s1_1 = this.game.add.bitmapText(this.game.width/2 - 315, this.game.height/2 - 230, 'SMW_Font', status1_1, 22);
  s1_1.fixedToCamera = true;
  var status1_2 = this.player1Score;
  var s1_2 = this.game.add.bitmapText(this.game.width/2 - 315, this.game.height/2 - 215, 'SMW_Font', '0'+status1_2, 28);
  s1_2.fixedToCamera = true;
  //var status2_1 = ;
  var s2_1 = this.game.add.image(this.game.width/2 - 115, this.game.height/2 - 214, "CoinCounter", 0);
  s2_1.fixedToCamera = true;
  var status2_2 = "x "+this.player1Coins;
  var s2_2 = this.game.add.bitmapText(this.game.width/2 - 85, this.game.height/2 - 216, 'SMW_Font', status2_2, 28);
  s2_2.fixedToCamera = true;
  var status3_1 = "WORLD";
  var s3_1 = this.game.add.bitmapText(this.game.width/2 + 71, this.game.height/2 - 230, 'SMW_Font', status3_1, 22);
  s3_1.fixedToCamera = true;
  //var status3_2 = ;
  var s3_2 = this.game.add.image(this.game.width/2 + 93, this.game.height/2 - 207, "world_1-1", 0);
  s3_2.fixedToCamera = true;
  var status4_1 = "TIME";
  var s4_1 = this.game.add.bitmapText(this.game.width/2 + 240, this.game.height/2 - 230, 'SMW_Font', status4_1, 22);
  s4_1.fixedToCamera = true;
  var status4_2 = this.timerTotal;
  var s4_2 = this.game.add.bitmapText(this.game.width/2 + 245, this.game.height/2 - 214, 'SMW_Font', status4_2, 27);
  s4_2.fixedToCamera = true;
  }
};
