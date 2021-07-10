function genFood() {
    x = genPosition((0.1 * game.canvas_dimension), (0.9 * game.canvas_dimension));
    y = genPosition((0.1 * game.canvas_dimension), (0.9 * game.canvas_dimension));

    document.getElementById("powerup").style.cssText = `
        top: ${y}px; 
        left: ${x}px;
    `;
}