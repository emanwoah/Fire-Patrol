//Rocket Patrol Mods [10 - 15 hours]
//by Emanuel Malig
//CMPM 120
//4/21/2021
//Completion time: 1 Day, 3 Hours.


//Screen Parallax (10 Points)
//Added two different backgrounds, scrolling at different speeds. 
//One background is the city, the other the clouds.

//Redesign Game Artwork UI (60)
//Changed the color of borders, and green border to navy blue.
//Changed the setting of space to a Marvel inspired game.
//Inspired from the Disney+ Show, The Falcon and Winter Soldier.

//Implement a simultaneous two-player mode (30)
//Added a second player, through the controls of (J, L) to move, and (H) to throw.

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play],
}

let game = new Phaser.Game(config);

//Set UI Sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT, keyH, keyJ, keyL;