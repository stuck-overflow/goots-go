socket = io("/goots", {});

socket.on('gootsup', (msg) => {
    console.log('gootsup');
    gootsUp();
});

socket.on('gootsdown', (msg) => {
    console.log('gootsdown');
    gootsDown();
});

socket.on('gootsfast', (msg) => {
    console.log('gootsfast');
    gootsFast();
});

socket.on('gootsslow', (msg) => {
    console.log('gootsslow');
    gootsSlow();
});

socket.on('gootsgo', (msg) => {
    console.log('gootsgo');
    gootsGo();
});

socket.on('gootsreset', (msg) => {
    console.log('gootsreset');
    gootsReset();
});

console.log('sockets set up');


let angle;
let position;
let shot = false;
let goots_live = true;
let speed = 50;
let hit = false;

let ball;
let box;

function setup() {
    createCanvas(1920, 1080);
    goots = loadImage('assets/goots.png')
    angle = -PI / 4;
    position = createVector(0, 1000);
    box_position = createVector(random(1920 / 2, 1920), random(0, 1080))
    ball = new CannonBall(position.x, position.y);
}

function draw() {
    clear()
    background(0, 0, 0, 0);
    push();
    translate(position.x, position.y);
    rotate(angle);
    rect(0, -5, 50, 10);
    pop();
    image(goots, box_position.x, box_position.y - 10, 100, 100)

    if (shot) {
        let gravity = new createVector(0, 0.2);
        ball.applyForce(gravity);
        ball.update();
    }
    ball.display();

    if (ball.position.y > height || ball.position.y < 0 || ball.position.x > width || ball.position.x < 0) {
        goots_live = true;
        ball = new CannonBall(position.x, position.y);
        shot = false;
    }

    if (keyIsDown(RIGHT_ARROW)) {
        angle += 0.1;
    } else if (keyIsDown(LEFT_ARROW)) {
        angle -= 0.1;
    }
    hit = collidePointPointVector(ball.position, box_position, 10);
    if (hit) {
        console.log("HITTTT GOOOTSSS");
        hit = false;
    }
}

function gootsDown() {
    angle += 0.1;
}

function gootsUp() {
    angle -= 0.1;
}

function gootsFast() {
    speed += 10;
}

function gootsSlow() {
    speed -= 10;
}

function gootsReset() {
    speed = 50;
    angle = 90;
}

function gootsGo() {
    // if (key == ' ') {
    if (goots_live) {
        shot = true;
        goots_live = false;
        let force = p5.Vector.fromAngle(angle);
        force.mult(speed);
        ball.applyForce(force);
    }
    // }
}
