window.onload = main;

function main() {
    var c = document.getElementById("fractalCanvas");
    var canvasContainer = document.getElementById("fractalBlock");

    c.width = canvasContainer.offsetWidth;
    c.height = canvasContainer.offsetHeight;

    var ctx = c.getContext("2d");

    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.rect(0, 0, c.width, c.height);
    ctx.stroke();

    var initialPoint1 = new Point(950, 10);
    var initialPoint2 = new Point(50, 950);
    var initialPoint3 = new Point(1850, 950);

    drawTriangle(initialPoint1, initialPoint2, initialPoint3, ctx);

    sierpinski(7, initialPoint1, initialPoint2, initialPoint3, ctx);
}

function Point(x, y) {
    this.x = x;
    this.y = y; 
}

function drawTriangle(point1, point2, point3, ctx) {
    ctx.moveTo(point1.x, point1.y);

    ctx.lineTo(point2.x, point2.y);
    ctx.lineTo(point3.x, point3.y);
    ctx.lineTo(point1.x, point1.y);

    ctx.stroke();
}

function sierpinski(iteration, point1, point2, point3, ctx) {
    var midpoint1 = midpoint(point1, point2);
    var midpoint2 = midpoint(point2, point3);
    var midpoint3 = midpoint(point3, point1);

    drawTriangle(midpoint1, midpoint2, midpoint3, ctx);

    iteration -= 1;

    setTimeout(() => {
        if(iteration === 0) {
            return;
        } else {
            sierpinski(iteration, point1, midpoint1, midpoint3, ctx);
            sierpinski(iteration, midpoint1, point2, midpoint2, ctx);
            sierpinski(iteration, midpoint3, midpoint2, point3, ctx);
        }
    }, 500)
}

function midpoint(point1, point2) {
    var mid = new Point();
    mid.x = (point1.x + point2.x) / 2;
    mid.y = (point1.y + point2.y) / 2;
    return mid;
}