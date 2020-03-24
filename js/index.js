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
let start, end;

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
    favicon.setAttribute('href', canvas.toDataURL())
    move();
}

function move(foundFood = false) {
    if (!foundFood) {
        const removed = snakeArr.shift()
        delete snakeObj[`${removed.x},${removed.y}`]
    }
    const head = snakeArr[snakeArr.length - 1]
    const nextPoint = Object.assign({}, head)
    if (dir == DIRECTIONS.UP || dir == DIRECTIONS.DOWN) {
        nextPoint.y = (nextPoint.y + dir - 2 + size) % size;
    } else if (dir == DIRECTIONS.LEFT || dir == DIRECTIONS.RIGHT) {
        nextPoint.x = (nextPoint.x + dir - 1 + size) % size;
    }

    if (snakeObj[`${nextPoint.x},${nextPoint.y}`]) {
        if (score > highscore) {
            highscore = score;
        }
        document.title = `favsnek | ${highscore}`
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

function handleGesture() {
    //Source: https://gist.github.com/SleepWalker/da5636b1abcbaff48c4d
    const {
        width,
        height
    } = document.body.getBoundingClientRect();
    const ratio_horizontal = (end.screenX - start.screenX) / width;
    const ratio_vertical = (end.screenY - start.screenY) / height;
    if (ratio_horizontal > ratio_vertical && ratio_horizontal > 0.1) {
        dir = DIRECTIONS.RIGHT;
    }
    if (ratio_vertical > ratio_horizontal && ratio_vertical > 0.1) {
        dir = DIRECTIONS.DOWN;
    }
    if (ratio_horizontal < ratio_vertical && ratio_horizontal < -0.1) {
        dir = DIRECTIONS.LEFT;
    }
    if (ratio_vertical < ratio_horizontal && ratio_vertical < -0.1) {
        dir = DIRECTIONS.UP;
    }

}


document.addEventListener('touchstart', (e) => {
    start = {
        screenX: e.changedTouches[0].screenX,
        screenY: e.changedTouches[0].screenY
    }
}, false);

document.addEventListener('touchend', (e) => {
    end = {
        screenX: e.changedTouches[0].screenX,
        screenY: e.changedTouches[0].screenY
    }
    handleGesture();
}, false);

function genFood() {
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
    const x = getRandomInt(0, size - 1);
    const y = getRandomInt(0, size - 1);
    if (snakeObj[`${x},${y}`]) {
        genFood()
        return
    }
    food.x = x
    food.y = y
}

setInterval(drawFavicon, 100);

document.addEventListener('keydown', (e) => {
    dir = Math.abs(e.keyCode - 37) <= 4 ? e.keyCode - 37 : dir
    if (e.keyCode == 72) {
        canvas.style.display = canvas.style.display == 'none' ? 'block' : 'none'
    }
})