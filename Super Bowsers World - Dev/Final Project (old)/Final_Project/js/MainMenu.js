var BowsersWorld = BowsersWorld || {};

//title screen
BowsersWorld.MainMenu = function(){};

BowsersWorld.MainMenu.prototype = {
  init: function(player1Score, player1Coins) {
    player1Score = player1Score || 0;
    this.lastScore = player1Score || 0;

    player1Coins = player1Coins || 0;
    this.lastCoins = player1Coins || 0;

    this.highestScore = this.highestScore || 0;
    this.highestScore = Math.max(player1Score, this.highestScore);
   },
  create: function() {
  	//show the title screen
    this.background = this.game.add.sprite(this.game.centerX, this.game.centerX, 'titleScreen');

    // Status Bar
    var status1_1 = "BOWSER";
    var s1_1 = this.game.add.bitmapText(this.game.width/2 - 315, this.game.height/2 - 230, 'SMW_Font', status1_1, 22);
    if(this.lastScore < 100){var status1_2 = '00000'+this.lastScore;}
    else if (this.lastScore < 1000){var status1_2 = '000'+this.lastScore;}
    else if (this.lastScore < 10000){var status1_2 = '00'+this.lastScore;}
    else {var status1_2 = '0'+this.lastScore;}
    var s1_2 = this.game.add.bitmapText(this.game.width/2 - 315, this.game.height/2 - 215, 'SMW_Font', status1_2, 28);
    //var status2_1 = ;
    var s2_1 = this.game.add.image(this.game.width/2 - 115, this.game.height/2 - 214, "CoinCounter", 0);
    if(this.lastCoins < 10){var status2_2 = "x 0"+this.lastCoins;}
    else{var status2_2 = "x "+this.lastCoins;}
    var s2_2 = this.game.add.bitmapText(this.game.width/2 - 85, this.game.height/2 - 216, 'SMW_Font', status2_2, 28);
    var status3_1 = "WORLD";
    var s3_1 = this.game.add.bitmapText(this.game.width/2 + 71, this.game.height/2 - 230, 'SMW_Font', status3_1, 22);
    //var status3_2 = ;
    var s3_2 = this.game.add.image(this.game.width/2 + 93, this.game.height/2 - 207, "world_1-1", 0);
    var status4_1 = "TIME";
    var s4_1 = this.game.add.bitmapText(this.game.width/2 + 240, this.game.height/2 - 230, 'SMW_Font', status4_1, 22);

    // Menu Text
    var text1 = "PLAYER GAME";
    var t1 = this.game.add.bitmapText(this.game.width/2 - 75, this.game.height/2 + 35, 'SMW_Font', text1, 24);
    var text2 = "PRESS ENTER TO BEGIN";
    var t2 = this.game.add.bitmapText(this.game.width/2 - 182, this.game.height/2 + 75, 'SMW_Font', text2, 24);

    // Highest score text
    var text3 = "TOP";
    var t3 = this.game.add.bitmapText(this.game.width/2 - 100, this.game.height/2 + 138, 'SMW_Font', text3, 23);
    if(this.highestScore < 100){var highScore = '00000'+this.highestScore;}
    else if (this.highestScore < 1000){var highScore = '000'+this.highestScore;}
    else if (this.highestScore < 10000){var highScore = '00'+this.highestScore;}
    else {var highScore = '0'+this.highestScore;}
    var t4 = this.game.add.bitmapText(this.game.width/2 + 20, this.game.height/2 + 132, 'SMW_Font', highScore, 30);

    // Mouse Click = Full Screen
    this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.input.onDown.add(this.goFull, this);
  },
  update: function() {
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER) ) {
      this.game.state.start('Game');
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
  }
};
