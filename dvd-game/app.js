// Declare variables
const FPS = 60;
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
let level = 0;
let score = 0;
let browserResize = false;
let tooSmall = false;
let start = false;

// Array of DVD logo images
let img = new Image();
let arrImages = ["dvdLogo1.png", "dvdLogo2.png", "dvdLogo3.png", "dvdLogo4.png", "dvdLogo5.png", "dvdLogo6.png", "dvdLogo7.png", "dvdLogo8.png"];
img.src = arrImages[Math.floor(Math.random() * arrImages.length)];

// Ball size
let bsWidth = 300;
let bsHeight = 157;

// Ball position x, y
let bx, by;

// Ball velocity x, y (in pixels per second, aka how many pixels it moves per frame)
let xv, yv;

// Set ball position to middle of canvas
bx = document.body.clientWidth / 2;
by = document.body.clientHeight / 2;

// Random ball starting speed (between 50 and 100 pixels per second)
xv = 1;
yv = 1;

// Random ball direction
if (Math.floor(Math.random() * 2) === 0) {
    xv = -xv;
}
if (Math.floor(Math.random() * 2) === 0) {
    yv = -yv;
}

let gameMsg = document.getElementById("gameMsg");

// Keyboard controls that change direction of logo
let recent = false;
document.addEventListener('keydown', function (event) {
    if (start) {
        if (!browserResize) {
            if (!recent) {
                switch (event.code) {
                    case "ArrowDown":
                        // Make logo change direction to downwards, if the ball is moving upwards
                        if (yv < 0) {
                            score += 1;
                            recent = true;
                            setTimeout(function () {
                                recent = false;
                            }, 100);
                            yv = Math.abs(yv);
                        }
                        break;
                    case "ArrowUp":
                        // Make logo change direction to upwards, if the ball is moving downwards
                        if (yv > 0) {
                            score += 1;
                            recent = true;
                            setTimeout(function () {
                                recent = false;
                            }, 100);
                            yv = -yv;
                        }
                        break;
                    case "ArrowLeft":
                        // Make logo change direction to left, if the ball is moving right
                        if (xv > 0) {
                            score += 1;
                            recent = true;
                            setTimeout(function () {
                                recent = false;
                            }, 100);
                            xv = -xv;
                        }
                        break;
                    case "ArrowRight":
                        // Make logo change direction to right, if the ball is moving left
                        if (xv < 0) {
                            score += 1;
                            recent = true;
                            setTimeout(function () {
                                recent = false;
                            }, 100);
                            xv = Math.abs(xv);
                        }
                        break;
                }
            } else {
                gameMsg.innerHTML = "You can only move once per 100 milliseconds.";
                gameMsg.style.display = "block";
                gameMsg.style.opacity = "100%";
                setTimeout(function () {
                    gameMsg.style.opacity = "0%";
                }, 500);
            }
        } else {
            gameMsg.innerHTML = "You cannot resize the window while the game is running. Refresh your browser to restart.";
            gameMsg.style.display = "block";
            gameMsg.style.opacity = "100%";
        }
    }
});

function drawConfetti() {
    if (start) {
        if (party) {
            // Create confetti effect using party.js
            party.confetti(party.Rect.fromScreen(), {
                count: 300 * (window.innerWidth / 1980),
                countVariation: 0.5,
                angleSpan: 0,
                yVelocity: -100,
                yVelocityVariation: 2,
                rotationVelocityLimit: 6,
                scaleVariation: 0.8
            });
            gameMsg.innerHTML = "Congrats! The more levels you complete, the faster the logo moves.";
            gameMsg.style.display = "block";
            gameMsg.style.opacity = "100%";
            setTimeout(function () {
                gameMsg.style.opacity = "0%";
            }, 2000);

            level += 1;
            xv = xv * 1.1;
            yv = yv * 1.1;

            // Resets DVD logo position so you can't spam it
            bx = canvas.width / 2;
            by = canvas.height / 2;
        } else {
            setTimeout(drawConfetti, 50);
        }
    }
}

// Ensures the new DVD logo color is different than the current one
function changeImg() {
    let newSrc;
    do {
        newSrc = arrImages[Math.floor(Math.random() * arrImages.length)];
    } while (newSrc === img.src);
    return newSrc;
}

let xBounds = false;
let yBounds = false;

// Responsible for: redrawing canvas per frame, ball movement, DVD logo color change, making the ball bounce off walls, and checking for corner hits
function update() {
    document.body.querySelector("#level i").innerHTML = level;
    document.body.querySelector("#score i").innerHTML = score;
    if (document.body.clientWidth < img.width * 3 || document.body.clientHeight < img.height * 3) {
        tooSmall = true;
    }
    if (!browserResize) {
        if (!tooSmall) {
            // Move the ball
            bx += xv;
            by += yv;

            // Bounce the ball off each wall
            if (bx - bsWidth / 2 < 0 && xv < 0) {
                yBounds && drawConfetti();
                xBounds = true;
                setTimeout(function () {
                    xBounds = false;
                }, 50);
                xv = -xv;
                img.src = changeImg();
            }
            if (bx + bsWidth / 2 > canvas.width && xv > 0) {
                yBounds && drawConfetti();
                xBounds = true;
                setTimeout(function () {
                    xBounds = false;
                }, 50);
                xv = -xv;
                img.src = changeImg();
            }
            if (by - bsHeight / 2 < 0 && yv < 0) {
                xBounds && drawConfetti();
                yBounds = true;
                setTimeout(function () {
                    yBounds = false;
                }, 50);
                yv = -yv;
                img.src = changeImg();
            }
            if (by + bsHeight / 2 > canvas.height && yv > 0) {
                xBounds && drawConfetti();
                yBounds = true;
                setTimeout(function () {
                    yBounds = false;
                }, 50);
                yv = -yv;
                img.src = changeImg();
            }

            // Draw background and DVD logo
            context.fillStyle = "black";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, bx - bsWidth / 2, by - bsHeight / 2);
        } else {
            gameMsg.innerHTML = "Your browser window is too small. Resize your browser and refresh the page. Mobile is currently not supported.";
            gameMsg.style.display = "block";
            gameMsg.style.position = "absolute";
            gameMsg.style.top = "50%";
            gameMsg.style.margin = "auto";
            gameMsg.style.opacity = "100%";
            document.body.style.backgroundColor = "black";
        }
    } else {
        gameMsg.innerHTML = "You cannot resize the window while the game is running. Refresh your browser to restart.";
        gameMsg.style.display = "block";
        gameMsg.style.position = "absolute";
        gameMsg.style.top = "50%";
        gameMsg.style.margin = "auto";
        gameMsg.style.opacity = "100%";
        document.body.style.backgroundColor = "black";
    }
    window.requestAnimationFrame(update);
}

window.addEventListener('resize', function () {
    browserResize = true;
    document.querySelector("#start").style.display = "none";
    document.querySelector("#level").style.display = "none";
    document.querySelector("#score").style.display = "none";
});

// Calls the update function every 1/60th of a second
window.requestAnimationFrame(update);
