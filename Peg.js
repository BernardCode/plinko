class Peg {
    constructor(x,y,radius){
        this.x=x;
        this.y=y;
        this.radius=radius;

        var options={
            isStatic:true,
            restitution:0.0
        }
        this.body = Matter.Bodies.circle(x,y,this.radius,options);
        World.add(world,this.body);
    }
    display() {
        var pos = this.body.position;
        push();
        fill(36, 120, 255);
        strokeWeight(1.0);
        stroke("cyan");
        ellipseMode(RADIUS);
        ellipse(pos.x,pos.y,this.radius);
        pop();
    }

    print(fwriter) {
        fwriter.print("0, "+ this.x +", " + this.y);
    }
}