  // Set up canvas
  var game = {
    canvas_dimension: 400,
  
    // If game is active
    started: false,
  };
  
  // Set up player variables
  var players = [];
  
  var player = {
    // Speed of player
    speed: [1, 1, 1, 1, 1, 1, 1, 1],
  
    // How quickly player can turn
    angle: [2, 2, 2, 2, 2, 2, 2, 2],
  
    // Player score
    score: [0, 0, 0, 0, 0, 0, 0, 0],
  
    // Keyboard controls
    keys: ['LEFT_ARROW', 'RIGHT_ARROW', 'A', 'D', 'J', 'L', 'Q', 'E', 'U', 'O', 'Z', 'C', 'B', 'M', '8', '0'],
    keys_code: [
      [37, 39],
      [65, 68],
      [74, 76],
      [81, 69],
      [85, 79],
      [90, 67],
      [66, 77],
      [56, 48]
    ],
  
    // Player aesthetic
    player_colour: ["red", "blue", "green", "yellow", "pink", "white", "orange", "lime"],
    player_width: [5, 5, 5, 5, 5, 5, 5, 5],
  
    // If player is active
    started: [],
  };
  
  // Setup canvas
  function setup() {
    canvas = createCanvas(game.canvas_dimension, game.canvas_dimension);
    colorMode(HSB);
    background('black');
    canvas.parent('containerCurve');
  }
  
  // Change swatches to player colours
  onload = function () {
    for (var i = 0; i < 8; i++) {
      bgColour = player.player_colour[i];
      document.getElementById(`player-colour-${i}`).setAttribute("style", `background-color: ${bgColour};`);
    }
  };