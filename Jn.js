function Star(id, x, y) { //背景的星星，构造函数
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = Math.floor(Math.random() * 2) + 1; //随机数然后取整
    var alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2;
    this.color = "rgba(255,255,255," + alpha + ")";
}

//构造函数，不动的天蝎座星点
function Star1(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = 5;
    var alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2;
    this.color = "rgba(255,255,255," + alpha + ")";

}

// 心宿二直接定义
// var xinsu2 = {
//     id: '1',
//     x: '606',
//     y: '335',
//     r: '4',
//     alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2,
//     color = "rgba(255,255,255," + alpha + ")",

// }

Star.prototype.draw = function() {
    ctx.fillStyle = this.color;
    ctx.shadowBlur = this.r * 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
}

// 画星函数，画出心宿二等星星
Star1.prototype.draw1 = function() {

    ctx.fillStyle = this.color;
    ctx.shadowBlur = this.r * 2;
    //ctx.shadowBlur = 4 * 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
}

// function draw2() {

//     ctx.fillStyle = this.color;
//     ctx.shadowBlur = this.r * 2;
//     //ctx.shadowBlur = 4 * 2;
//     ctx.beginPath();
//     ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
//     ctx.closePath();
//     ctx.fill();
// }



Star.prototype.move = function() {
    this.y -= .15;
    if (this.y <= -10) this.y = HEIGHT + 10;
    this.draw();
}

Star.prototype.die = function() {
    stars[this.id] = null;
    delete stars[this.id];
}


function Dot(id, x, y, r) { //鼠标的点
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = Math.floor(Math.random() * 5) + 1; //随机数*5取整+1
    this.maxLinks = 2;
    this.speed = .5;
    this.a = .5;
    this.aReduction = .005;
    this.color = "rgba(255,255,255," + this.a + ")"; //rgba(255,255,255,.5);
    //rgba()
    this.linkColor = "rgba(255,255,255," + this.a / 4 + ")";
    //console.log("fgf(" + a + ")");

    this.dir = Math.floor(Math.random() * 140) + 200;
}

Dot.prototype.draw = function() {
    ctx.fillStyle = this.color;
    ctx.shadowBlur = this.r * 2;
    ctx.beginPath();
    //创建弧线或圆//
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
}

Dot.prototype.link = function() {
    if (this.id == 0) return;
    var previousDot1 = getPreviousDot(this.id, 1);
    var previousDot2 = getPreviousDot(this.id, 2);
    var previousDot3 = getPreviousDot(this.id, 3);
    if (!previousDot1) return;
    ctx.strokeStyle = this.linkColor;
    ctx.moveTo(previousDot1.x, previousDot1.y);
    ctx.beginPath();
    ctx.lineTo(this.x, this.y);
    if (previousDot2 != false) ctx.lineTo(previousDot2.x, previousDot2.y);
    if (previousDot3 != false) ctx.lineTo(previousDot3.x, previousDot3.y);
    ctx.stroke();
    ctx.closePath();
}

function getPreviousDot(id, stepback) {
    if (id == 0 || id - stepback < 0) return false;
    if (typeof dots[id - stepback] != "undefined") return dots[id - stepback];
    else return false; //getPreviousDot(id - stepback);
}

Dot.prototype.move = function() {
    this.a -= this.aReduction; //this.a = this.a-this.aReduction;
    if (this.a <= 0) {
        this.die();
        return
    }
    this.color = "rgba(255,255,255," + this.a + ")";
    this.linkColor = "rgba(255,255,255," + this.a / 4 + ")";
    this.x = this.x + Math.cos(degToRad(this.dir)) * this.speed,
        this.y = this.y + Math.sin(degToRad(this.dir)) * this.speed;

    this.draw();
    this.link();
}

Dot.prototype.die = function() {
    dots[this.id] = null;
    delete dots[this.id];
}

// ctrl+f 快速查找代码
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    WIDTH,
    HEIGHT,
    mouseMoving = false, //自定义的鼠标移动	
    mouseMoveChecker,
    mouseX,
    mouseY,
    stars = [],
    stark,
    stars1 = [];
// on = [] = new Star;
initStarsPopulation = 80,
    dots = [],
    dotsMinDist = 2,
    maxDistFromCursor = 50;

setCanvasSize();
init();
// init()->animate()->调动move函数，同时move函数内置了画星函数
function setCanvasSize() {
    WIDTH = document.documentElement.clientWidth,
        HEIGHT = document.documentElement.clientHeight;

    canvas.setAttribute("width", WIDTH);
    canvas.setAttribute("height", HEIGHT);
    console.log("" + WIDTH + HEIGHT);
}

function init() {
    ctx.strokeStyle = "white";
    ctx.shadowColor = "white";
    for (var i = 0; i < initStarsPopulation; i++) { //定义80个点
        stars[i] = new Star(i, Math.floor(Math.random() * WIDTH), Math.floor(Math.random() * HEIGHT));
        //stars[i].draw();
    }
    ctx.shadowBlur = 0;
    animate();
}

function animate() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT); //清空画布内容

    for (var i in stars) {
        //背景星星移动
        stars[i].move();
    }
    for (var i in dots) {
        //鼠标星星移动
        dots[i].move();
    }
    ctx.shadowBlur = 0;
    stark = new Star1(1, 606, 335); //心宿二
    stars1[0] = new Star1(2, 751, 213);
    stars1[1] = new Star1(3, 766, 280);
    stars1[2] = new Star1(4, 755, 356);
    stars1[3] = new Star1(5, 572, 367);
    stars1[4] = new Star1(6, 491, 386);
    stars1[5] = new Star1(7, 473, 565);
    stars1[6] = new Star1(8, 454, 655);
    stars1[7] = new Star1(9, 382, 668); //5
    stars1[8] = new Star1(10, 284, 661); //4
    stars1[9] = new Star1(11, 242, 599); //3
    stars1[10] = new Star1(12, 262, 565); //2
    stars1[11] = new Star1(13, 299, 534);
    stars1[12] = new Star1(14, 745, 423); //最新一颗


    // xinsu2.draw1();

    // stars1[0].draw1();
    stark.draw1();
    for (var i = 0; i < 13; i++) {
        stars1[i].draw1()
    }
    //stars[i].draw();
    drawIfMouseMoving();
    requestAnimationFrame(animate); //请求动画帧,相当于一个自动定时器，按帧清空递归清空画布内容
}

window.onmousemove = function(e) {
    mouseMoving = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
    clearInterval(mouseMoveChecker);
    mouseMoveChecker = setTimeout(function() {
        mouseMoving = false;
    }, 100);
}

/*鼠标移动调用全部函数*/
function drawIfMouseMoving() {
    if (!mouseMoving) return;

    if (dots.length == 0) {
        dots[0] = new Dot(0, mouseX, mouseY);
        dots[0].draw();
        return;
    }

    var previousDot = getPreviousDot(dots.length, 1);
    var prevX = previousDot.x;
    var prevY = previousDot.y;

    var diffX = Math.abs(prevX - mouseX);
    var diffY = Math.abs(prevY - mouseY);

    if (diffX < dotsMinDist || diffY < dotsMinDist) return;

    var xVariation = Math.random() > .5 ? -1 : 1;
    xVariation = xVariation * Math.floor(Math.random() * maxDistFromCursor) + 1;
    var yVariation = Math.random() > .5 ? -1 : 1;
    yVariation = yVariation * Math.floor(Math.random() * maxDistFromCursor) + 1;
    dots[dots.length] = new Dot(dots.length, mouseX + xVariation, mouseY + yVariation);
    dots[dots.length - 1].draw();
    dots[dots.length - 1].link();
}
//setInterval(drawIfMouseMoving, 17);

function degToRad(deg) {
    return deg * (Math.PI / 180);
}
//————————————————————————————————家宁天蝎座连线————————————————————————————————————//
const points = [
    [299, 534], //上
    [262, 565], //右
    [242, 599], //左
    [284, 661], //上
    [382, 668], //下
    [454, 655], //左
    [473, 565], //右
    [491, 386],
    [572, 367],
    [606, 335],
    [766, 280],
    // [751, 213],
    // [755, 356],
    //[745,423]

];
const canvasx = document.getElementById("canvasx");
const ctxx = canvasx.getContext("2d");
const speed = 1; //速度
setCanvasSizes(); //方法调用
// init()->animate()->调动move函数，同时move函数内置了画星函数
function setCanvasSizes() {

    canvasx.setAttribute("width", WIDTH);
    canvasx.setAttribute("height", HEIGHT);
    console.log("" + WIDTH + HEIGHT);
}
lineMove(points);

function lineMove(points) {
    if (points.length < 2) {
        //ctx.clearRect(0, 0, width, height); //清空画布内容
        return;
    }
    const [
        [x1, y1],
        [x2, y2]
    ] = points;
    let dx = x2 - x1;
    let dy = y2 - y1;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {

        points = points.slice(1);
        lineMove(points);
        return;
    }
    let x = x1,
        y = y1; //线条绘制过程中的终点
    if (dx === 0) {
        (x = x2), (y += (speed * dy) / Math.abs(dy));
    } else if (dy === 0) {
        x += (speed * dx) / Math.abs(dx);
        y = y2;
    } else if (Math.abs(dx) >= 1) {
        let rate = dy / dx;
        x += (speed * dx) / Math.abs(dx);
        y += (speed * rate * dx) / Math.abs(dx);
    }
    drawLine(x1, y1, x, y); //调用画线方法
    points[0] = [x, y];
    window.requestAnimationFrame(function() {
        lineMove(points); //递归调用?
    });
}

function drawLine(x1, y1, x2, y2) { //画线
    ctxx.save();
    ctxx.beginPath(); //不写每次都会重绘上次的线
    ctxx.lineCap = "round";
    ctxx.lineJoin = "round";
    //var grd = ctx.createLinearGradient(x1, y1, x2, y2);

    ctxx.moveTo(x1, y1);
    ctxx.lineTo(x2, y2);
    ctxx.closePath();
    ctxx.strokeStyle = "rgba(255,255,255,1)";
    ctxx.stroke();
    ctxx.restore();
}
//————————————————最后四个点的连线——————————————————————————————————//
const points1 = [
    [751, 213],
    [766, 280],
    [755, 356],
    [745, 423]
]
setCanvasSizes1(); //方法调用
function setCanvasSizes1() {

    canvasx.setAttribute("width", WIDTH);
    canvasx.setAttribute("height", HEIGHT);
    // console.log("" + WIDTH + HEIGHT);
}
setTimeout(lineMove2, 10000);

function lineMove2() {
    lineMove1(points1)
}

function lineMove1(points1) {
    if (points.length < 2) {
        //ctx.clearRect(0, 0, width, height); //清空画布内容
        return;
    }
    const [
        [x1, y1],
        [x2, y2]
    ] = points1;
    let dx = x2 - x1;
    let dy = y2 - y1;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {

        points1 = points1.slice(1);
        lineMove1(points1);
        return;
    }
    let x = x1,
        y = y1; //线条绘制过程中的终点
    if (dx === 0) {
        (x = x2), (y += (speed * dy) / Math.abs(dy));
    } else if (dy === 0) {
        x += (speed * dx) / Math.abs(dx);
        y = y2;
    } else if (Math.abs(dx) >= 1) {
        let rate = dy / dx;
        x += (speed * dx) / Math.abs(dx);
        y += (speed * rate * dx) / Math.abs(dx);
    }
    drawLine1(x1, y1, x, y); //调用画线方法
    points1[0] = [x, y];
    window.requestAnimationFrame(function() {
        lineMove1(points1); //递归调用
    });
}

function drawLine1(x1, y1, x2, y2) { //画线
    ctxx.save();
    ctxx.beginPath(); //不写每次都会重绘上次的线
    ctxx.lineCap = "round";
    ctxx.lineJoin = "round";
    //var grd = ctx.createLinearGradient(x1, y1, x2, y2);

    ctxx.moveTo(x1, y1);
    ctxx.lineTo(x2, y2);
    ctxx.closePath();
    ctxx.strokeStyle = "rgba(255,255,255,1)";
    ctxx.stroke();
    ctxx.restore();
}

setTimeout(AS, 11000);

function AS() {
    var a = document.getElementById('as');
    a.innerHTML = "<p><a href='#'>家宁生日快乐</a></p>  <p><a href='#'>Happy Birthday</a></p> <p><a href='#'>这不比仰望星空有趣得多</a></p> ";




}