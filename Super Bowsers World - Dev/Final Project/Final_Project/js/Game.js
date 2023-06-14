var BowsersWorld = BowsersWorld || {};

//title screen
BowsersWorld.Game = function(){};

BowsersWorld.Game.prototype = {

  create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      // Initialize Variables
      this.map;
      this.tileset;
      this.layer;
      this.cursors;
      this.coins;
      this.player1Coins = 0;
      this.player1Score = 0;
      this.timer;
      this.timerTotal = 0;
      this.endTimer;
      this.endTimerTotal = 0;
      this.fireTimer;
      this.fireTimerTotal = 0;
      this.flames;
      this.flamesTime = 0;
      this.fireTime = 0;
      this.s1_2;
      this.s2_2;
      this.s3_2;
      this.s4_2;

  		// Create the game timer
      this.timerTotal = 150;
  		this.timer = this.game.time.create(false);
  		this.timer.loop(1000, this.timerUpdate, this);
  		this.timer.start();

      // Create timer for returning to main menu
      this.endTimerTotal = 160;
      this.endTimer = this.game.time.create(false);
      this.endTimer.loop(1000, this.endTimerUpdate, this);
      this.endTimer.start();

      // Create timer for returning to main menu
      this.fireTimerTotal = 0;
      this.fireTimer = this.game.time.create(false);
      this.fireTimer.loop(1000, this.fireTimerUpdate, this);
      this.fireTimer.start();

  		// Generate the map
  		this.game.stage.backgroundColor = '#6888ff';
      this.map = this.game.add.tilemap('SMB_Map');
      this.map.addTilesetImage('1 - 1', 'tiles');
  		this.layer = this.map.createLayer('World1-1');
  		this.layer.resizeWorld();
  		this.map.setLayer(this.layer);
      this.statusBar();

  		// Set Tile Collisions  (14 = ? block, 15 = brick, 11 = coins, {5,10,13,17}=Flag Pole, {33,39} = door, {20,29}=Castle Roof)
  		this.map.setCollisionBetween(14,16);
  		this.map.setCollisionBetween(20,22);
  		this.map.setCollisionBetween(27,29);
  		this.map.setCollision(40);

      // Tile Collision for exit door to end the game
      this.map.setTileIndexCallback(33, this.exitDoor, this);
      this.map.setTileIndexCallback(39, this.exitDoor, this);
      this.setTileCollision(this.layer, [20, 29], {
        top: true,
        bottom: false,
        left: false,
        right: false
      });

  		// Create the players sprite and its parameters
      this.player = this.game.add.sprite(160, 175, 'bowserLarge');
      this.game.physics.arcade.enable(this.player);
  		this.game.camera.follow(this.player);
      this.player.body.collideWorldBounds = true;
  		this.player.body.gravity.y = 6000;
      this.player.animations.add('left', [0, 1, 2, 3], 10, true);
      this.player.animations.add('right', [5, 6, 7, 8], 10, true);

  		// World physics
  		this.game.physics.arcade.gravity.y = 000;
  		this.game.physics.arcade.TILE_BIAS = 40;
  		this.game.physics.arcade.checkCollision.down = false;
  		this.game.physics.arcade.checkCollision.up = false;

      //  Create Coins group to collect with physics
      this.coins = this.game.add.group();
      this.coins.enableBody = true;

  		// Create Coins across the map with slight variance each time.
  		for (var i = 1; i < 20; i++)
      {
          //  Create a coin inside of the 'coins' group
          var coin = this.coins.create(this.game.world.randomX, 0, 'coin');
          //  Sets coins gravity
          coin.body.gravity.y = 4000;
      }

      // Create Enemies group
      this.enemy = this.game.add.group();
      this.enemy.enableBody = true;
      this.enemy.physicsBodyType = Phaser.Physics.ARCADE;
      this.enemy.collideWorldBounds = false;
      for (var i = 0; i < 9; i++)
      {
          var mario = this.enemy.create(this.game.world.randomX, 100, 'marioLarge');
          mario.body.gravity.y = 5000;
          mario.frame = 6;
      }

      for (var i = 0; i < 8; i++)
      {
          var luigi = this.enemy.create(this.game.world.randomX, 100, 'luigiLarge');
          luigi.body.gravity.y = 1000;
          luigi.frame = 6;
      }

      //  Our bullet group
      this.flames = this.game.add.group();
      this.flames.enableBody = true;
      this.flames.physicsBodyType = Phaser.Physics.ARCADE;
      this.flames.createMultiple(300, 'bowserFlame');
      this.flames.setAll('anchor.x', 0.5);
      this.flames.setAll('anchor.y', 1);
      this.flames.setAll('outOfBoundsKill', true);
      this.flames.setAll('checkWorldBounds', true);

  		// Input
      this.cursors = this.game.input.keyboard.createCursorKeys();
  		this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  		this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  		this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  		this.game.input.keyboard.addKey(Phaser.Keyboard.D);
  		this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  		this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
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
      this.flameSFX = this.game.add.audio('flameSFX');
      this.thwompSFX = this.game.add.audio('thwompSFX');
  },

  update: function() {
  	  this.player.body.velocity.x = 0;

  		this.game.physics.arcade.collide(this.player, this.layer);
      this.game.physics.arcade.collide(this.coins, this.layer);
      this.game.physics.arcade.collide(this.enemy, this.layer);
      this.game.physics.arcade.collide(this.flames, this.layer, this.killFlame);
      this.game.physics.arcade.collide(this.enemy, this.flames, this.flameEnemyCollision);

  		//  Checks to see if the player overlaps with any of the coins and calls the collectCoin function
  		this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);

      //  Checks to see if the player overlaps with any of the enemies and calls the hitEnemy function
      this.game.physics.arcade.overlap(this.player, this.enemy, this.hitEnemy, null, this);

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
  			}
  		else
  		   {
  	     		//  Stand still
  	       this.player.animations.stop();
  	       this.player.frame = 4;
  		   }
  		if (this.cursors.up.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.W))
  	 		{
  					this.player.checkWorldBounds = true;
  	 				if (this.player.body.onFloor())
  	 				{
  	 					this.player.body.velocity.y = -1300;
  	 					this.jumpSFX.play();
  	 				}
  	 		}
      if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))
      {
        this.breathFire();
      }
  },

  breathFire: function() {
      //  To avoid them being allowed to fire too fast we set a time limit
      if (this.game.time.now > this.fireTime)
      {
          //  Grab the first flame we can from the pool
          flame = this.flames.getFirstExists(false);

          if (flame)
          {
            if(this.player.body.velocity.x < 0)
            {
              //this.player.animations.play('breathFireLeft');
              this.player.animations.add('breathFireLeft', [1, 0], 10, true).play();
              this.flameSFX.play();
              flame.reset(this.player.x - 20, this.player.y + 31);
              flame.body.velocity.x = -500;
              this.fireTime = this.game.time.now + 800;
              flame.animations.add('flameLeft', [0, 1], 10, true).play();
            } else
            {
              //this.player.animations.play('breathFireRight');
              this.player.animations.add('breathFireRight', [8, 7], 10, true).play();
              this.flameSFX.play();
              flame.reset(this.player.x + 50, this.player.y + 31);
              flame.body.velocity.x = 500;
              this.fireTime = this.game.time.now + 800;
              flame.animations.add('flameRight', [2, 3], 10, true).play();
            }
          }
      }
  },

  killFlame: function(flame){flame.kill();},

  //  Called if the flame hits one of the enemy sprites
  flameEnemyCollision: function(enemy, flame)
  {
      flame.kill();
      enemy.kill();
      this.player1Score += 500;
  },

  hitEnemy: function (player, enemy)
  {
      // if the player is above the enemy, the enemy is killed, otherwise the player dies
      if (enemy.body.touching.up) {
          this.player1Score += 500;
          enemy.kill();
          this.thwompSFX.play();
      } else {
          this.gameOver();
      }
  },

  collectCoin: function(player, coin)
  {
  		// Plays coin sound
  		this.coinSFX.play();
      // Removes the coin from the screen
      coin.kill();
      //  Add and update the score
      this.player1Score += 200;
      if (this.player1Score < 1000){this.s1_2.text = "000"+this.player1Score;}
      else if (this.player1Score < 10000){this.s1_2.text = "00"+this.player1Score;}
      else {this.s1_2.text = "0"+this.player1Score;}
      // Add and update Coins Counter
      this.player1Coins += 1;
      if(this.player1Coins < 10){this.s2_2.text = "x 0"+this.player1Coins;}
      else{this.s2_2.text = "x "+this.player1Coins;}
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
    this.s1_2.text = "0"+this.player1Score;
    // Removes Player's Sprite and returns to main menu
  	this.player.kill();
    this.endTimerTotal = 7;
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
    this.endTimerTotal = 1;
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
  	emitter.makeParticles('fireWorks');
  	emitter.minParticleSpeed.setTo(-500, -500);
  	emitter.maxParticleSpeed.setTo(500, 500);
  	emitter.gravity = 0;
  	emitter.start(true, 2000, null, 7);
    emitter.forEach(function(singleParticle){singleParticle.animations.add('fireWorksAnmation', null, 5, true).play();});
    // Kills Player and returns to main menu
    this.player.kill();
    this.endTimerTotal = 4;
  },

  timerUpdate: function()
  {
  		this.timerTotal -= 1;
      this.s4_2.text = this.timerTotal;
  		// Plays Hurry Up Music when timer reaches 45seconds
  		if (this.timerTotal == 43)
  		{
  			this.music.stop();
  			this.hurryMusic.play();
  		}
  		// Kills player if time runs out
  		if (this.timerTotal == 0)
  		{this.gameOver();}
  },

  endTimerUpdate: function()
  {
      this.endTimerTotal -= 1;
      if(this.endTimerTotal == 0)
      {this.game.state.start('MainMenu', true, false, [this.player1Score, this.player1Coins]);}
  },

  fireTimerUpdate: function()
  {
      this.fireTimerTotal -= 1;
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

   setTileCollision: function(mapLayer, idxOrArray, dirs) {

    var mFunc; // tile index matching function
    if (idxOrArray.length) {
        // if idxOrArray is an array, use a function with a loop
        mFunc = function(inp) {
            for (var i = 0; i < idxOrArray.length; i++) {
                if (idxOrArray[i] === inp) {
                    return true;
                }
            }
            return false;
        };
    } else {
        // if idxOrArray is a single number, use a simple function
        mFunc = function(inp) {
            return inp === idxOrArray;
        };
    }
    // get the 2-dimensional tiles array for this layer
    var d = mapLayer.map.layers[mapLayer.index].data;

    for (var i = 0; i < d.length; i++) {
        for (var j = 0; j < d[i].length; j++) {
            var t = d[i][j];
            if (mFunc(t.index)) {
                t.collideUp = dirs.top;
                t.collideDown = dirs.bottom;
                t.collideLeft = dirs.left;
                t.collideRight = dirs.right;

                t.faceTop = dirs.top;
                t.faceBottom = dirs.bottom;
                t.faceLeft = dirs.left;
                t.faceRight = dirs.right;
            }
        }
    }
},

  // Create Top Status Bar
  statusBar: function()
  {
  var status1_1 = "BOWSER";
  this.s1_1 = this.game.add.bitmapText(this.game.width/2 - 315, this.game.height/2 - 230, 'SMW_Font', status1_1, 22);
  this.s1_1.fixedToCamera = true;
  var status1_2 = "00000"+this.player1Score;
  this.s1_2 = this.game.add.bitmapText(this.game.width/2 - 315, this.game.height/2 - 215, 'SMW_Font', status1_2, 28);
  this.s1_2.fixedToCamera = true;
  //var status2_1 = ;
  this.s2_1 = this.game.add.image(this.game.width/2 - 115, this.game.height/2 - 214, "CoinCounter", 0);
  this.s2_1.fixedToCamera = true;
  this.s2_1.animations.add('coin_counter', null, 5, true).play();
  if(this.player1Coins < 10){var status2_2 = "x 0"+this.player1Coins;}
  else{var status2_2 = "x "+this.player1Coins;}
  this.s2_2 = this.game.add.bitmapText(this.game.width/2 - 85, this.game.height/2 - 216, 'SMW_Font', status2_2, 28);
  this.s2_2.fixedToCamera = true;
  var status3_1 = "WORLD";
  this.s3_1 = this.game.add.bitmapText(this.game.width/2 + 71, this.game.height/2 - 230, 'SMW_Font', status3_1, 22);
  this.s3_1.fixedToCamera = true;
  //var status3_2 = ;
  this.s3_2 = this.game.add.image(this.game.width/2 + 93, this.game.height/2 - 207, "world_1-1", 0);
  this.s3_2.fixedToCamera = true;
  var status4_1 = "TIME";
  this.s4_1 = this.game.add.bitmapText(this.game.width/2 + 240, this.game.height/2 - 230, 'SMW_Font', status4_1, 22);
  this.s4_1.fixedToCamera = true;
  var status4_2 = this.timerTotal;
  this.s4_2 = this.game.add.bitmapText(this.game.width/2 + 249, this.game.height/2 - 214, 'SMW_Font', status4_2, 27);
  this.s4_2.fixedToCamera = true;
  }
};
