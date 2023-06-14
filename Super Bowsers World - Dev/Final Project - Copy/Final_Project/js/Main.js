var BowsersWorld = BowsersWorld || {};

BowsersWorld.game = new Phaser.Game(853, 480, Phaser.CANVAS, 'Bowsers_World');

BowsersWorld.game.state.add('Boot', BowsersWorld.Boot);
BowsersWorld.game.state.add('Preload', BowsersWorld.Preload);
BowsersWorld.game.state.add('MainMenu', BowsersWorld.MainMenu);
BowsersWorld.game.state.add('Game', BowsersWorld.Game);

BowsersWorld.game.state.start('Boot');
