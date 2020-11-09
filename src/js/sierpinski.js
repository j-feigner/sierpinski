window.onload = main;

function main() {
    var c = document.getElementById("fractalCanvas");
    var canvasContainer = document.getElementById("fractalBlock");

    c.width = canvasContainer.offsetWidth;
    c.height = canvasContainer.offsetHeight;

    var ctx = c.getContext("2d");

    var view = new Viewport(0, 0, c.width, c.height);

    ctx.beginPath();
    ctx.translate(0.5, 0.5);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "blue";

    var initialPoint1 = new Point(950, 10);
    var initialPoint2 = new Point(50, 950);
    var initialPoint3 = new Point(1850, 950);

    drawTriangle(initialPoint1, initialPoint2, initialPoint3, ctx);

    //sierpinski(9, initialPoint1, initialPoint2, initialPoint3, ctx);

    ctx.stroke();
    ctx.closePath();

    var scrollValue = 0;
    var is_dragging = false;

    var scrollValueDisplay = document.getElementById("scrollValue");
    var draggingDisplay = document.getElementById("draggingValue");
    var viewXValueDisplay = document.getElementById("viewXValue");
    var viewYValueDisplay = document.getElementById("viewYValue");

    scrollValueDisplay.innerHTML = scrollValue;
    draggingDisplay.innerHTML = is_dragging;
    viewXValueDisplay.innerHTML = view.originX;
    viewYValueDisplay.innerHTML = view.originY;

    var dragStartX = 0;
    var dragStartY = 0;
    var dragDiffX = 0;
    var dragDiffY = 0;

    var viewStartX = view.originX;
    var viewStartY = view.originY;

    c.addEventListener("wheel", (event) => {
        scrollValue -= event.deltaY * 0.01;

        scrollValueDisplay.innerHTML = scrollValue;
    })
    c.addEventListener("mousedown", (event) => {
        is_dragging = true;

        dragStartX = event.offsetX;
        dragStartY = event.offsetY;
        viewStartX = view.originX;
        viewStartY = view.originY;

        draggingDisplay.innerHTML = is_dragging;
    })
    c.addEventListener("mousemove", (event) => {
        if(is_dragging) {
            dragDiffX = event.offsetX - dragStartX;
            dragDiffY = event.offsetY - dragStartY;

            view.originX = viewStartX + dragDiffX;
            view.originY = viewStartY + dragDiffY;

            viewXValueDisplay.innerHTML = view.originX;
            viewYValueDisplay.innerHTML = view.originY;
        }
    })
    c.addEventListener("mouseup", () => {
        is_dragging = false;

        draggingDisplay.innerHTML = is_dragging;
    })
}

function Point(x, y) {
    this.x = x;
    this.y = y; 
}

function Viewport(originX, originY, width, height) {
    this.originX = originX;
    this.originY = originY;
    this.width = width;
    this.height = height;
}

function drawTriangle(point1, point2, point3, ctx) {
    ctx.moveTo(point1.x, point1.y);

    ctx.lineTo(point2.x, point2.y);
    ctx.lineTo(point3.x, point3.y);
    ctx.lineTo(point1.x, point1.y);
}

function sierpinski(iteration, point1, point2, point3, ctx) {
    var midpoint1 = midpoint(point1, point2);
    var midpoint2 = midpoint(point2, point3);
    var midpoint3 = midpoint(point3, point1);

    drawTriangle(midpoint1, midpoint2, midpoint3, ctx);

    iteration -= 1;

    if(iteration === 0) {
        return;
    } else {
        sierpinski(iteration, point1, midpoint1, midpoint3, ctx);
        sierpinski(iteration, midpoint1, point2, midpoint2, ctx);
        sierpinski(iteration, midpoint3, midpoint2, point3, ctx);
    }
}

function midpoint(point1, point2) {
    var mid = new Point();
    mid.x = (point1.x + point2.x) / 2;
    mid.y = (point1.y + point2.y) / 2;
    return mid;
}