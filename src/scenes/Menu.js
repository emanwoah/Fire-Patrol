class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/ding.wav');
        this.load.audio('sfx_explosion', './assets/dink.wav');
        this.load.audio('sfx_shield', './assets/newthor.wav');
      }

    create() {
        // menu configuration
        let menuConfig = {
            fontFamily: 'Arial',
            frontSize: '24px',
            backgroundColor: '#f3b141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0,
        }

        //show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 
            'Shield Toss ft. Captain America & US Agent', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 
            'Use (<- ->) to move Red Shield, (F) to throw. Use (J, L) to move Black Shield, (H) to throw.', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 
            'Press <- for Easy mode or -> for Hard mode', menuConfig).setOrigin(0.5);

                // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }
    update() {
            if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
              // easy mode
              game.settings = {
                spaceshipSpeed: 2,
                gameTimer: 60000    
              }
              this.sound.play('sfx_select');
              this.scene.start('playScene');    
            }
            if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
              // hard mode
              game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000    
              }
              this.sound.play('sfx_select');
              this.scene.start('playScene');    
            }
          }
}