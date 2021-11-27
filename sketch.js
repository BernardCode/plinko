const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;
const Events = Matter.Events;

let engine;
let world;
var bg,bgImg, bounceSound;
var peg;
var pegs = [];
var ball;
var gameOver, gameOverImg;
// GameState values
// 0: Drag ball around with mouse
// 1: Ball is falling
// 3: Ball done falling and waiting 2 seconds
// 2: Game Over after 5 tries
var gameState=0;
var tries=0;
var bar;
var bars= [];
var score=0;
var bgMusic;
var points = 0;

function preload()
{
  bgImg = loadImage("bg.png");
  bgMusic = loadSound("background_music.mp3");
  bounceSound = loadSound("bounce1.wav");
  gameOverImg = loadImage("gameover.jpg");
}

function setup() {
  createCanvas(640, 400);
  engine = Engine.create();
  world = engine.world;

  bg = createSprite(320,200);
  bg.addImage("background", bgImg);
  bg.scale=2.3;

  bgMusic.setLoop(true);
  bgMusic.play();
  bgMusic.setVolume(0.05);


  CreatePegs();
  CreateBars();

  document.addEventListener('mousemove', (event) => {
    //console.log(`Mouse X: ${event.clientX}, Mouse Y: ${event.clientY}`);
  });
  Events.on(engine, 'collisionStart', function(event) {
    event.pairs.forEach(function(obj){
      console.log('BodyA is static: ' + obj.bodyA.isStatic + '. BodyB is static: ' + obj.bodyB.isStatic);
      bounceSound.setVolume(0.13);
      bounceSound.play();
      
    })
  });
}

function draw() {
  Engine.update(engine);
  drawSprites();

  var posX;
  var posY;

  if(gameState==0){
    if (mouseX >= 530) {
      posX = 530;
    } else
    if(mouseX<530 && mouseX>100){
      posX=mouseX;
    } else
    if (mouseX <= 100) {
      posX = 100;
    }
    posY=60;
  }else if(gameState==1 || gameState==3){
    posX=ball.body.position.x;
    posY=ball.body.position.y;
  }
  if(gameState==0 && keyDown("space") && mouseX<530 && mouseX>100){
    gameState=1;
    ball=new Ball(mouseX,70,10);
  }


  // Checking if ball is done, award score, starting 2 second timer, change gameState = 3
  if(gameState==1){
    var pos=ball.body.position;
    
    if(pos.y>327) {
      gameState = 3; // Ball must wait 2 seconds
      if(pos.x>113&& pos.x<190){
        score += 100;
      }
      if(pos.x>198&& pos.x<274){
        score += 500;
      }
      if(pos.x>282&& pos.x<358) {
        score += 1000;
      }
      if(pos.x>366&& pos.x<442) {
        score += 500;
      }
      if(pos.x>450&& pos.x<525){
        score += 100;
      }
      ball.body.restitution = 0.0;
      tries+=1;
      setTimeout(BallIsFinished, 2000);
    }
  }

  if (tries>4) {
    gameState=2;
  }

  if(tries<5){
    bar.display();
    for (var i=0;i<pegs.length;i++){
      pegs[i].display();
    }
    for (var i=0;i<bars.length;i++){
      bars[i].display();
    }

    textSize(36);
    strokeWeight(1);
    stroke("cyan");
    fill("cyan");
    text ("PLINKO",255,50);
    textSize(15);
    fill("yellow");
    text("+100",130,340);
    textSize(15);
    fill("yellow");
    text("+500",220,340);
    textSize(15);
    fill("yellow");
    text("+1000",300,340);
    textSize(15);
    fill("yellow");
    text("+500",387,340);
    textSize(15);
    fill("yellow");
    text("+100",470,340);
    textSize(25);
    fill("hotpink");
    text("Score:" + score,500,40);
  }


  if (gameState==1) {
    ball.display(posX, posY);
  } else {
    push();
    ellipseMode(RADIUS);
    fill(255, 61, 129);
    ellipse(posX,posY,10, 10);
    pop();
  }
  if(gameState==2) {
    gameOver = createSprite(320,200);
    gameOver.addImage("gameover", gameOverImg);
  }
}

// Called after 2 second timer is complete, after Ball is done.
function BallIsFinished() {
  gameState=0;
  ball.body.restitution = 1.0;
}

function CreatePegs(){
  var x=random(490,530), y, col=0;

  // Create 9 columns of pegs
  for (; col<11; col++) {

    // Even numbered columns start higher
    if (col%2==0) {
       y=90;
    } else {
       y=115;
    }

    // Creating a column of pegs
    for(;y<300;y+=50) {
      peg=new Peg(x,y,11);
      pegs.push(peg);
    }

    x -= 40;
  }
}
function CreateBars() {
  bar=new Bar(320,360,430,15);
  bars.push(bar);

  for(var x=110;x<580;x+=84) {
    bar=new Bar(x,340,10,25);
    bars.push(bar);
  }
  
}