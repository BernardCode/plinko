class Ball {
    constructor(x,y,radius){
        this.x=x;
        this.y=y;
        this.radius=radius;

        var ballOptions={
            restitution:0.87
        }
        this.body = Matter.Bodies.circle(x,y,this.radius,ballOptions);
        World.add(world,this.body);
    }
    display(x,y) {
        push();
        ellipseMode(RADIUS);
        fill(255, 61, 129);
        ellipse(x,y,this.radius, this.radius);
        pop();
    }
}