class Play extends Phaser.Scene{
    constructor() {
        super("playScene");
    }
    preload() {
        //adds sprites
        this.load.image('city', './assets/city.png');
        this.load.image('cloud', './assets/cloud.png');
        this.load.image('hydra', './assets/hydra64.png');
        this.load.image('shield', './assets/shield.png');
        this.load.image('stealth', './assets/stealthshield.png');
        // loads sprite
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        this.cloud = this.add.tileSprite(0,0,640,480, 'cloud',).setOrigin(0,0);
        this.city = this.add.tileSprite(0,0,640,480, 'city',).setOrigin(0,0);
        // Blue UI
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x1F).setOrigin(0, 0);
        // Black Borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0x000000).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x000000).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x000000).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x000000).setOrigin(0, 0);

        // intialize shields
        this.p1Cap = new Cap(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'shield').setOrigin(0.5, 0);
        this.p1Stealth = new Shield(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'stealth').setOrigin(1.5, 0);


        // adds 3 hydra logos
        this.ship01 = new Hydra(this, game.config.width + borderUISize*6, borderUISize*4, 'hydra', 0, 30).setOrigin(0, 0);
        this.ship02 = new Hydra(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'hydra', 0, 20).setOrigin(0,0);
        this.ship03 = new Hydra(this, game.config.width, borderUISize*6 + borderPadding*4, 'hydra', 0, 10).setOrigin(0,0);
        

        // define controls & keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);

        // config animations
        this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
        frameRate: 30});

        //initialize score
        this.p1Score = 0;
        // display score
        let scoreConfig = {
            fontFamily: 'Arial',
            fontSize: '28px',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            align: 'center',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // 60 sec Clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(60000, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart', scoreConfig).setOrigin(0.5);
        }, null, this);

        // Game Over
        this.gameOver = false;

        // 60 sec Clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(60000, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // move environments
        this.city.tilePositionX -= 2;
        this.cloud.tilePositionX -= 4;
          // restarts game
            if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
                this.scene.restart();
            }
        if(!this.gameOver) {
            // moves player / shoot
            this.p1Cap.update();
            this.p1Stealth.update();
            

            // update the 3 spaceships
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }
        // check collisions
        if(this.checkCollision(this.p1Cap, this.ship03)) {
            this.shipExplode(this.ship03);
            this.p1Cap.reset();
        }
        if (this.checkCollision(this.p1Cap, this.ship02)) {
            this.shipExplode(this.ship02);
            this.p1Cap.reset();
        }
        if (this.checkCollision(this.p1Cap, this.ship01)) {
            this.shipExplode(this.ship01);
            this.p1Cap.reset();
        }

        if(this.checkCollision(this.p1Stealth, this.ship03)) {
            this.shipExplode(this.ship03);
            this.p1Stealth.reset();
        }
        if (this.checkCollision(this.p1Stealth, this.ship02)) {
            this.shipExplode(this.ship02);
            this.p1Stealth.reset();
        }
        if (this.checkCollision(this.p1Stealth, this.ship01)) {
            this.shipExplode(this.ship01);
            this.p1Stealth.reset();
        }
        

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
    }
    checkCollision(rocket, ship) {
        // AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } 
        else {
            return false;
        }
    }
    
    shipExplode(ship) {
        // temp hide ship
        ship.alpha = 0;
        // explodes at ship position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // calls animation
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // ship visible
          boom.destroy();                       // remove explosion sprite
        });    
        //score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;   

        this.sound.play('sfx_explosion');
      }
}