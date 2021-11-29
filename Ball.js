class Ball {
    constructor(x,y,radius){
        this.radius=radius;

        // Help ball track gameState and mouse position
        this.mouseX = x;
        this.mouseY = y;
        this.gameState = game_state_new_ball;

        var ballOptions={
            restitution:0.87
        }
        this.body = Matter.Bodies.circle(x,y,this.radius,ballOptions);
        World.add(world,this.body);
    }

    // When gameState is game_state_new_ball, help ball follow mouse pointer
    setMousePosition(mouseX, mouseY) {
        this.mouseX = mouseX;
        this.mouseY = mouseY;
    }

    // When gameState changes, tell ball the new state
    setGameState(newGameState) {
        this.gameState = newGameState;

        // If the game changed to In Play, then reset ball body to current mouse position
        if (newGameState == game_state_in_play) {
            Body.setPosition(this.body, {x: this.mouseX, y: this.mouseY});
            Body.setVelocity(this.body, {x : 0, y: 0});
        }
    }

    // Draws the ball, either at mouse or body position.
    display() {
        var drawX, drawY;

        push();
        ellipseMode(RADIUS);
        fill(255, 61, 129);

        // Set drawX, drawY to be either mouse or body position.
        if (this.gameState == game_state_new_ball) {
            drawX = this.mouseX;
            drawY = this.mouseY;
        } else {
            drawX = this.body.position.x;
            drawY = this.body.position.y;
        }

        ellipse(drawX, drawY,this.radius, this.radius);
        pop();
    }
}