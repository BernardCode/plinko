const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;
const Events = Matter.Events;

// game_state_new_ball: Drag ball around with mouse
const game_state_new_ball = Symbol("new_ball");
// game_state_in_play: Ball is falling
const game_state_in_play = Symbol("in_play");
// game_state_game_over: game Over after 5 tries
const game_state_game_over = Symbol("game_over");
// game_state_ball_waiting: Ball went offscreen or landed in cup, and is waiting 2 seconds to reset
const game_state_ball_resting = Symbol("ball_waiting");

let engine;
let world;
var bg,bgImg, bounceSound;
var peg;
var pegs = [];
var ball;
var gameOver, gameOverImg;
var gameState=game_state_new_ball;
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

  bgMusic.setLoop(true);
  bgMusic.play();
  bgMusic.setVolume(0.05);

  CreatePegs();
  CreateBars();
  ball = new Ball(100, 70, 10);

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

// (1) Run engine; (2) Update objects; (3) Draw objects
function draw() {
  var posX;
  var posY;

  Engine.update(engine);

  if(gameState==game_state_new_ball){
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
    ball.setMousePosition(posX, posY);
  }else if(gameState==game_state_in_play || gameState==game_state_ball_resting){
    posX=ball.body.position.x;
    posY=ball.body.position.y;
  }
  if(gameState==game_state_new_ball && keyDown("space")){
    ChangeGameState(game_state_in_play);
  }

  // Checking if ball is done, award score, starting 2 second timer, change gameState = game_state_ball_resting
  if(gameState==game_state_in_play){
    var pos=ball.body.position;
    
    if(pos.y>327) {
      ChangeGameState(game_state_ball_resting); // Ball must wait 2 seconds
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
    ChangeGameState(game_state_game_over)
  }

  // All Display work happens here
  background(bgImg);

  // Draw bars, pegs, text
  if (gameState!==game_state_game_over) {
    DrawText();
    DrawPegs();
    DrawBars();
    ball.display();
  } else {
    gameOver = createSprite(320,200);
    gameOver.addImage("gameover", gameOverImg);
    drawSprites();
  }
}

function DrawPegs() {
  for (var i=0;i<pegs.length;i++){
    pegs[i].display();
  }
}

function DrawBars() {
  bar.display();
  for (var i=0;i<bars.length;i++){
    bars[i].display();
  }
}

function DrawText() {
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
// Tell the entire world the new gameState
function ChangeGameState(newGameState) {
  gameState = newGameState;
  ball.setGameState(newGameState);
}

// Called after 2 second timer is complete, after Ball is done.
function BallIsFinished() {
  ChangeGameState(game_state_new_ball);
  ball.body.restitution = 0.87;
}

function CreatePegs(){
  var x=515, y, col=0;

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