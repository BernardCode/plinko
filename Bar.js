class Bar{
    constructor(x,y,width,height) {
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        var barOptions={
            isStatic:true,
            restitution:0.0
        }

        this.body=Matter.Bodies.rectangle(x,y,this.width,this.height,barOptions); 
        World.add(world,this.body);
    }
    display() {
        push ();

        var pos=this.body.position;
        fill("black");
        strokeWeight(1.0);
        stroke("cyan");
        rectMode(CENTER);
        rect(pos.x,pos.y,this.width,this.height);
        
        pop ();
    }
}