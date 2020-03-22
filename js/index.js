const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const favicon = document.getElementById('favicon');
const size = 16;
let highscore = 0;
canvas.width = size;
canvas.height = size;
const DIRECTIONS = {
    LEFT: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3
}
let dir, score, snakeArr, snakeObj, food;

function setup() {
    scoreElement.innerText = ''
    dir = DIRECTIONS.DOWN;
    score = 0;
    snakeArr = [{
        x: 0,
        y: 0
    }, {
        x: 0,
        y: 1
    }]
    snakeObj = {}
    snakeArr.forEach(e => snakeObj[`${e.x},${e.y}`] = true)
    food = {
        x: 8,
        y: 8
    };
}
setup()
function drawFavicon() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);
    snakeArr.forEach((point, i) => {
        ctx.fillStyle = i == snakeArr.length - 1 ? '#008f00' : '#00ff00'
        ctx.fillRect(point.x, point.y, 1, 1)
    })
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(food.x, food.y, 1, 1)
    move();
    const dataURL = canvas.toDataURL();
    favicon.setAttribute('href', dataURL)
}

function move(foundFood = false) {
    if (!foundFood) {
        const removed = snakeArr.shift()
        delete snakeObj[`${removed.x},${removed.y}`]
    }
    const head = snakeArr[snakeArr.length - 1]
    nextPoint = Object.assign({}, head)
    switch (dir) {
        case DIRECTIONS.UP:
            nextPoint.y = (nextPoint.y - 1 + size) % size;
            break;
        case DIRECTIONS.DOWN:
            nextPoint.y = (nextPoint.y + 1) % size;
            break;
        case DIRECTIONS.LEFT:
            nextPoint.x = (nextPoint.x - 1 + size) % size;
            break;
        case DIRECTIONS.RIGHT:
            nextPoint.x = (nextPoint.x + 1) % size;
            break;
    }
    if (snakeObj[`${nextPoint.x},${nextPoint.y}`]) {
        if (score > highscore) {
            highscore = score;
        }
        score = 0;
        document.title = `favesnake | ${highscore}`
        setup()
        return;
    }
    snakeArr.push(nextPoint)
    snakeObj[`${nextPoint.x},${nextPoint.y}`] = true;
    if (nextPoint.x == food.x && nextPoint.y == food.y) {
        genFood()
        scoreElement.innerText = `Score: ${++score}`
        move(true)
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genFood() {
    let x = getRandomInt(0, size - 1);
    let y = getRandomInt(0, size - 1);
    if (snakeObj[`${x},${y}`]) {
        genFood()
        return
    }
    food.x = x
    food.y = y
}

setInterval(drawFavicon, 100);

document.addEventListener('keydown', logKey);

function logKey(e) {
    dir = Math.abs(e.keyCode - 37) <= 4 ? e.keyCode - 37 : dir
    if (e.keyCode == 72) {
        canvas.style.display = canvas.style.display == 'none' ? 'block' : 'none'
    }
}