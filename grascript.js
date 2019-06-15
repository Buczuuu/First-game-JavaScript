const canvas_1 = document.getElementById('canvas');
const ctx = canvas_1.getContext('2d');
            
canvas_1.width = 1000;
canvas_1.height = 500;
            
let playerScore = 0;
let aiScore = 0;

const ScorePlayer = document.getElementById('playerPKT');
const ScoreAi = document.getElementById('aiPKT');
            
//parametry boiska
const cw = canvas_1.width;
const ch = canvas_1.height;
            
//linia środka boiska
const lineWidth = 6;
const lineHeight = 16;
           
//piłka
const ballSize = 20;
let ballX = cw / 2 - ballSize / 2;
let ballY = ch / 2 - ballSize / 2;  
            
//prędkość piłki
let ballSpeedX = 3;
let ballSpeedY = 3;
            
//rakietki
const paddelHeight = 100;
const paddelWidth = 20;

//odległości paletek od końca boiska
const playerX = 70;
const aiX = 910;
            
//odległości paletek od boków boiska
let playerY = 200;
let aiY = 200;
            
//pozycja gry w przeglądarce
cancasTop = canvas_1.offsetTop;

let newGame = true;

function aiMove()
{
    const middlePadel = aiY + paddelHeight/2;
    const middleBall = ballY + ballSize/2;
    
    if(ballX >= 500)
    {
        if(middlePadel - middleBall > 200)
        {
            aiY -= 15;
        }
        else if(middlePadel - middleBall > 40)
        {
            aiY -= 8;        
        }
        else if(middlePadel - middleBall < -200)
        {
            aiY += 15;
        }
        else if(middlePadel - middleBall < -40)
        {
            aiY += 8;
        }   
    }
    else if(ballX < 500)
    {
        if(middlePadel - middleBall > 100)
        {
            aiY -= 4;
        }
        else if(middlePadel - middleBall < -100)
        {
            aiY += 4;
        }
    }
}

//ruch paletki
function playerPosition(e) //e = event
		{
			playerY = e.clientY - cancasTop - paddelHeight/2;
			
			//zabezpieczenie wyjezdzania paletek poza canvas
			if (playerY >= ch - paddelHeight)
			{
				playerY = ch - paddelHeight
			}
			
			if (playerY <= 0)
			{
				playerY = 0;
			}
			
		}

canvas_1.addEventListener("mousemove",playerPosition)

//stół
function table() 
{
    //tło
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,cw,ch);
    
    //linia po środku
    ctx.fillStyle = 'grey';
    for(let linePosition = 20; linePosition < ch; linePosition += 30)
    {
        ctx.fillRect(cw/2 - lineWidth/2, linePosition, lineWidth, lineHeight)
    }
}

function reset(who)
{
    if(who)
    {
        ScorePlayer.textContent = ++playerScore;
    }
    else
    {
        ScoreAi.textContent = ++aiScore;
    }
    newGame = true;
}

function ballReset()
{
    ballX = playerX + paddelWidth;
    ballY = playerY + paddelHeight/2 - ballSize/2;
    ctx.fillStyle = 'yellow';
    ctx.fillRect(ballX, ballY, ballSize, ballSize);

    canvas_1.addEventListener("click",play);
}

function play()
{
    newGame = false;
    ballSpeedX = 3;
    ballSpeedY = 3;
}

//ruch piłki
function ball()
{
    ctx.fillStyle = 'yellow';
    ctx.fillRect(ballX, ballY, ballSize, ballSize);

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if(ballY <= 0)
    {
        ballSpeedY *= -1;
        ballY = 0;
        speedUp();
    }

    if(ballY >= ch - ballSize)
    {
        ballSpeedY *= -1;
        ballY = ch - ballSize;
        speedUp();
    }

    if(ballX + ballSize >= cw)
    {
        reset(true);
    }

    if(ballX <= 0)
    {
        reset(false);
    }

    if(ballX <= playerX + paddelWidth && 
       ballX >= playerX && 
       ballY + ballSize >= playerY && 
       ballY <= playerY + paddelHeight)
    { 
        ballSpeedX *= -1;
        ballX = playerX + paddelWidth;  
        speedUp();
    }

    if(ballX + ballSize >= aiX && 
       ballX + ballSize <= aiX + paddelWidth &&
       ballY + ballSize >= aiY && 
       ballY <= aiY + paddelHeight)
    {
        ballSpeedX *= -1;
        ballX = aiX - ballSize;
        speedUp();
    }
} 

function speedUp()
{
    ballSpeedX *= 1.05;
    ballSpeedY *= 1.02;
    
    if(ballSpeedX > 16)
    {
        ballSpeedX = 16;
    }
    
    if(ballSpeedY > 10)
    {
        ballSpeedY = 10;
    }
}

    
function player()
{
    ctx.fillStyle = 'chartreuse';
    ctx.fillRect(playerX, playerY, paddelWidth, paddelHeight);
}

function ai()
{
    ctx.fillStyle = 'red';
    ctx.fillRect(aiX, aiY, paddelWidth, paddelHeight);
}

function game()
{
    table();
    if(!newGame)
    {
        ball();
    }
    else
    {   
        ballReset();
    }
    player();
    ai();
    aiMove();
}

setInterval(game,1000/60);
