const canvas_res = [800, 800];
const res = [64, 64];
const pixel_size = [canvas_res[0] / res[0], canvas_res[1] / res[1]];

const snake = new DoubleLinked.List();
// Create the snake's head
snake.push([Math.floor(res[0] / 3), Math.floor(res[1] / 2)]);
snake.push([snake.head.data[0] - 1, snake.head.data[1]]);

const apple = [Math.floor(res[0] * 2 / 3), Math.floor(res[1] / 2)];

let direction = [0, 0];

function draw_pixel(coords) {
  rect(coords[0] * pixel_size[0], coords[1] * pixel_size[1], ...pixel_size);
}

function lose() {
  alert("You Lost");
  noLoop();
}

function setup() {
  createCanvas(...canvas_res);
  noSmooth();
  noStroke();
}

const tick_end = 1e3 / 20;
let tick_clock = 0;

function draw() {
  // Calculate every tick
  tick_clock += deltaTime;
  if (tick_clock >= tick_end && (direction[0] != 0 || direction[1] != 0)) {
    tick_clock = 0;
    
    // Calculate movement
    const new_head = snake.tail;
    snake.tail = snake.tail.before;
    snake.tail.next = null;
    new_head.before = null;
    new_head.next = snake.head;
    snake.head.before = new_head;
    const old_tail = new_head.data;
    new_head.data = [snake.head.data[0] + direction[0], snake.head.data[1] + direction[1]];
    snake.head = new_head;
    
    // Calculate out of bounds
    for (const i in snake.head.data)
      if (snake.head.data[i] < 0 || snake.head.data[i] >= res[i])
        lose();
    
    // Calculate self collision
    if (get((snake.head.data[0] + 0.5)  * pixel_size[0], (snake.head.data[1] + 0.5)  * pixel_size[1])[1] == 255)
        lose();
    
    // Calculate consumption
    if (snake.head.data[0] == apple[0] && snake.head.data[1] == apple[1]) {
      snake.push(old_tail);
      for (let i in apple)
        apple[i] = Math.floor(Math.random() * res[i]);
    }
  }
  
  background(0);
  
  // Draw the snake
  push();
  {
    fill(0, 255, 0);
    for (let node = snake.head; node != null; node = node.next)
      draw_pixel(node.data);
  }
  pop();
  
  // Draw the apple
  push();
  {
    fill(255, 0, 0);
    draw_pixel(apple);
  }
  pop();
}

function keyPressed() {
  const old_direction = direction;
  
  switch(key) {
    case "ArrowUp":
      direction = [0, -1];
      break;
    case "ArrowDown":
      direction = [0, 1];
      break;
    case "ArrowLeft":
      direction = [-1, 0];
      break;
    case "ArrowRight":
      direction = [1, 0];
      break;
  }
  
  if (direction[0] == -old_direction[0] && direction[1] == -old_direction[1])
    direction = old_direction;
}