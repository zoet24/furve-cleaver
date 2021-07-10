  // Clear board between games
  function clearBoard() {
    canvas = document.getElementById("defaultCanvas0");
    canvas_ctx = canvas.getContext("2d");
    canvas_ctx.fillStyle = 'black';
    canvas_ctx.fillRect(0, 0, game.canvas_dimension, game.canvas_dimension);
  }
  
  // Generate random position within canvas
  function genPosition(positionMin, positionMax) {
    return (Math.floor(Math.random() * (positionMax - positionMin)) + positionMin);
  }
  
  // Generate random orientation within canvas
  function genAngle(angleMin, angleMax) {
    return ((Math.random() * (angleMax - angleMin)) + angleMin);
  }
  
  // Pass in number of players from UI and generate random position and angles for each player
  function start(num_players) {
    if (game.started == false) {
      players = [];
      player.started = [];
      clearance = 0.95;
      clearBoard();
  
      for (var i = 0; i < num_players; i++) {
        player.started.push(true);
  
        // Separate starting positions into separate quadrants to prevent early collisions
        if (i % 4 == 0) {
          positionXMin = (1 - clearance) * game.canvas_dimension;
          positionXMax = clearance * (0.5 * game.canvas_dimension);
          positionYMin = (1 - clearance) * game.canvas_dimension;
          positionYMax = clearance * (0.5 * game.canvas_dimension);
        } else if (i % 4 == 1) {
          positionXMin = clearance * (0.5 * game.canvas_dimension);
          positionXMax = clearance * (game.canvas_dimension);
          positionYMin = clearance * (0.5 * game.canvas_dimension);
          positionYMax = clearance * (game.canvas_dimension);
        } else if (i % 4 == 2) {
          positionXMin = clearance * (0.5 * game.canvas_dimension);
          positionXMax = clearance * (game.canvas_dimension);
          positionYMin = (1 - clearance) * game.canvas_dimension;
          positionYMax = clearance * (0.5 * game.canvas_dimension);
        } else if (i % 4 == 3) {
          positionXMin = (1 - clearance) * game.canvas_dimension;
          positionXMax = clearance * (0.5 * game.canvas_dimension);
          positionYMin = clearance * (0.5 * game.canvas_dimension);
          positionYMax = clearance * (game.canvas_dimension);
        }
  
        x = genPosition(positionXMin, positionXMax);
        y = genPosition(positionYMin, positionYMax);
  
        // Change orientation of initial movement away from canvas walls
        if ((x >= 0) && (x < (0.5 * game.canvas_dimension)) && (y >= 0) && (y < (0.5 * game.canvas_dimension))) {
          angleMin = 1.75;
          angleMax = 2.25;
        } else if ((x >= 0.5 * game.canvas_dimension) && (x <= (game.canvas_dimension)) && (y >= 0) && (y < (0.5 * game.canvas_dimension))) {
          angleMin = 0.25;
          angleMax = 0.75;
        } else if ((x >= 0) && (x < (0.5 * game.canvas_dimension)) && (y >= (0.5 * game.canvas_dimension)) && (y < (game.canvas_dimension))) {
          angleMin = 1.25;
          angleMax = 1.75;
        } else {
          angleMin = 0.75;
          angleMax = 1.25;
        }
  
        angleMultiplier = genAngle(angleMin, angleMax);
        angle = Math.PI * angleMultiplier;
  
        line_tmp = new Line(x, y);
        line_tmp.add_position(x + player.speed[i], y + player.speed[i]);
        line_tmp.move(angle);
        players.push(line_tmp);
      }
  
      game.started = true;
      genFood();
  
    }
  }
  
  // Change path of player if keypad is pressed; if not continue in a straight line
  function draw() {
    if (game.started) {
      for (var i = 0; i < players.length; i++) {
        if (player.started[i] == true) {
          if (keyIsDown(player.keys_code[i][0])) {
            players[i].move(-player.angle[i] * Math.PI / 180);
          } else if (keyIsDown(player.keys_code[i][1])) {
            players[i].move(player.angle[i] * Math.PI / 180);
          } else {
            players[i].move(0);
          }
        }
      }
      var lose = Line.is_ended(players);
      if (lose != -1) {
        game.started = false;
      }
      Line.display_lines(players);
    }
  }
  
  function score() {
    index = player.started.indexOf(true);
    player.score[index] += 1;
    $(`#player-score-${index}`).text(`Score: ${player.score[index]}`);
  }
  
  // Construct line with position and angle
  class Line {
    constructor(a, b) {
      this.array = [];
      this.array.push([a, b]);
    }
  
    add_position(a, b) {
      this.array.push([a, b]);
    }
  
    // The player moves depending on the calculated angle
    move(angle) {
      var a = this.array[this.array.length - 2];
      var b = this.array[this.array.length - 1];
      var vectorx = (b[0] - a[0]);
      var vectory = (b[1] - a[1]);
  
      // Take the vector of the previous move and apply a rotation matrix
      var x = vectorx * Math.cos(angle) - vectory * Math.sin(angle);
      var y = vectorx * Math.sin(angle) + vectory * Math.cos(angle);
  
      // Add this new vector to the last coordinate
      var new_x = b[0] + x;
      var new_y = b[1] + y;
  
      this.array.push([new_x, new_y]);
    }
  
    // Display the last line
    display() {
      for (var i = this.array.length - 2; i < this.array.length - 1; i++) {
        line(this.array[i][0], this.array[i][1], this.array[i + 1][0], this.array[i + 1][1]);
      }
    }
  
    // Display line for each player
    static display_lines(player_lines) {
      for (var i = 0; i < player_lines.length; i++) {
        stroke(player.player_colour[i]);
        strokeWeight(player.player_width[i]);
        player_lines[i].display();
      }
    }
  
    // Check if the game is ended
    static is_ended(player_lines) {
      // Check if player has hit wall
      for (var i = 0; i < player_lines.length; i++) {
        for (var k = 0; k < 2; k++) {
          var x = player_lines[i].array[player_lines[i].array.length - 1][k];
          if (x <= 0 || x >= game.canvas_dimension) {
            print("Hit wall");
            player.started[i] = false;
            if (player.started.filter(Boolean).length == 1) {
              score();
              return true;
            }
          }
        }
      }
      // Check if player has hit itself/another player
      for (var i = 0; i < player_lines.length; i++) {
        for (var j = 0; j < player_lines.length; j++) {
          for (var k = 0; k < player_lines[j].array.length; k++) {
            var x = player_lines[i].array[player_lines[i].array.length - 1];
            var y = player_lines[j].array[k];
            if (Math.abs(x[0] - y[0]) < player.player_width[i] * 0.8 && (Math.abs(x[1] - y[1]) < player.player_width[i] * 0.8)) {
              // Check if player has hit itself
              if (i == j && k < player_lines[j].array.length - player.player_width[i] - 1) {
                print('Hit self');
                player.started[i] = false;
                if (player.started.filter(Boolean).length == 1) {
                  score();
                  return i;
                }
              }
              // Check if player has hit other player
              else if (i != j) {
                print("Hit other");
                player.started[i] = false;
                if (player.started.filter(Boolean).length == 1) {
                  score();
                  return i;
                }
              }
            }
          }
        }
      }
      return -1;
    }
  }