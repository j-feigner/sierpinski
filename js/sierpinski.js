window.onload = main;

function main() {
    var app = new Sierpinski();
    app.start();
}

function Point(x, y) {
    this.x = x;
    this.y = y; 
}

function Triangle(point1, point2, point3) {
    this.point1 = point1;
    this.point2 = point2;
    this.point3 = point3;
}

function Rectangle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;

    // Boolean function that returns true if given point is within bounds
    this.pointInBounds = function(point) {
        var x1 = this.x
        var x2 = this.x + this.w;
        var y1 = this.y;
        var y2 = this.y + this.h;
        if(point.x > x1 && point.x < x2 && point.y > y1 && point.y < y2) {
            return true;
        } else {
            return false;
        }
    }
}

class Sierpinski {
    constructor() {
        this.ui = document.getElementById("ui");
        this.zoomDisplay = ui.querySelector("#zoom-value");
        this.renderScaleInput = ui.querySelector("input[name='render']:checked");
        this.iterationInput = ui.querySelector("input[name='iteration-count']");
        this.submitButton = ui.querySelector("#submit");

        this.renderingCanvas = document.createElement("canvas");
        this.renderingCtx = this.renderingCanvas.getContext("2d");

        this.displayCanvas = document.getElementById("fractalCanvas");
        this.displayCtx = this.displayCanvas.getContext("2d");

        this.renderScaleFactor = this.renderScaleInput.value;
        this.iterations = this.iterationInput.value;

        this.zoom = 1.0;

        this.viewX = 0.0;
        this.viewY = 0.0;

        this.dragX = 0;
        this.dragY = 0;
        this.isDragging = false;

        this.timeouts = [];
    }

    start() {
        resetCanvasBitmap(this.displayCanvas);
        this.resizeRenderCanvas();
        this.createEventListeners();
        this.renderSierpinski();
    }

    updateFromUI() {
        this.renderScaleFactor = this.ui.querySelector("input[name='render']:checked").value;
        this.iterations = this.iterationInput.value;
    }

    resizeRenderCanvas() {
        this.renderingCanvas.width = this.displayCanvas.width * this.renderScaleFactor;
        this.renderingCanvas.height = this.displayCanvas.height * this.renderScaleFactor;
    }

    createEventListeners() {
        // Click and drag events
        this.displayCanvas.addEventListener("mousedown", () => {
            this.isDragging = true;
        })
        this.displayCanvas.addEventListener("mousemove", (event) => {
            if(this.isDragging) {
                this.viewX += event.movementX;
                this.viewY += event.movementY;

                this.draw();
            }
        })
        this.displayCanvas.addEventListener("mouseup", () => {
            this.isDragging = false;
        })

        // Zoom events
        this.displayCanvas.addEventListener("wheel", (event) => {
            var widthRatio = this.renderingCanvas.width / this.displayCanvas.width / this.zoom;
            var heightRatio = this.renderingCanvas.height / this.displayCanvas.height / this.zoom;

            var relativeX = (event.offsetX - this.viewX) * widthRatio;
            var relativeY = (event.offsetY - this.viewY) * heightRatio;

            this.zoom -= event.deltaY * 0.001 * this.zoom;
            this.zoom = Math.floor(this.zoom * 100) / 100;
            this.zoom = clamp(this.zoom, 0.5, 20.0);
            this.zoomDisplay.innerHTML = this.zoom + "x";

            this.viewX = event.offsetX - ((relativeX * this.displayCanvas.width * this.zoom) / this.renderingCanvas.width);
            this.viewY = event.offsetY - ((relativeY * this.displayCanvas.height * this.zoom) / this.renderingCanvas.height);

            //this.renderSierpinski();
            this.draw();
        })

        // UI Submit event
        this.submitButton.addEventListener("click", e => {
            this.timeouts.map(timeout => clearTimeout(timeout));
            this.timeouts = [];

            this.updateFromUI();

            this.resizeRenderCanvas();
            this.displayCtx.clearRect(0, 0, this.displayCanvas.width, this.displayCanvas.height);
            this.renderSierpinski();
        })
    }

    renderSierpinski() {
        // Line style settings for triangle
        this.renderingCtx.lineWidth = 1;
        this.renderingCtx.strokeStyle = "rgb(30, 70, 164)";

        // Create initial points of outer triangle
        var centerX = this.renderingCanvas.width / 2;
        var centerY = this.renderingCanvas.height * 2 / 3;

        var triangleHeight = this.renderingCanvas.height * 0.95;
        var halfSideLength = triangleHeight / Math.sqrt(3); 
        var apothem = triangleHeight / 3;
        var apothemComplement = triangleHeight - apothem;

        var point1 = new Point(centerX, centerY - apothemComplement);
        var point2 = new Point(centerX + halfSideLength, centerY + apothem);
        var point3 = new Point(centerX - halfSideLength, centerY + apothem);
        var outerTriangle = new Triangle(point1, point2, point3);

        // Set iteration count and call recursive function to draw to rendering canvas
        this.drawTriangle(this.renderingCtx, outerTriangle);
        this.renderingCtx.stroke();
        this.draw();
        this.timeouts.push(setTimeout(() => {
            this.sierpinskiTriangle(this.iterations, outerTriangle, this.renderingCtx, 1000);
        }, 1000))
    }

    draw() {
        this.displayCtx.clearRect(0, 0, this.displayCanvas.width, this.displayCanvas.height);
        this.displayCtx.drawImage(this.renderingCanvas, this.viewX, this.viewY, this.displayCanvas.width * this.zoom, this.displayCanvas.height * this.zoom);
    }

    drawTriangle(ctx, triangle) {
        ctx.moveTo(triangle.point1.x, triangle.point1.y);
        ctx.lineTo(triangle.point2.x, triangle.point2.y);
        ctx.lineTo(triangle.point3.x, triangle.point3.y);
        ctx.lineTo(triangle.point1.x, triangle.point1.y);   
    }

    // Recursive function that creates all lines within 
    // sierpinski triangle on a given iteration count.
    sierpinskiTriangle(iteration, triangle, ctx, animationDelay) {
        // Calculate midpoints between triangle points
        var midpointTriangle = new Triangle(
            midpoint(triangle.point1, triangle.point2),
            midpoint(triangle.point2, triangle.point3),
            midpoint(triangle.point3, triangle.point1)
        )

        // Draw inverted midpoint triangle
        this.drawTriangle(this.renderingCtx, midpointTriangle);

        // Animation draw step
        this.renderingCtx.stroke();
        this.draw();

        // Construct 3 smaller triangles from calculated midpoints
        var newTriangle1 = new Triangle(
                triangle.point1, 
                midpointTriangle.point1, 
                midpointTriangle.point3
        );
        var newTriangle2 = new Triangle(
                triangle.point2, 
                midpointTriangle.point1, 
                midpointTriangle.point2
        );
        var newTriangle3 = new Triangle(
                triangle.point3, 
                midpointTriangle.point2, 
                midpointTriangle.point3
        );

        if(--iteration === 0) {
            this.isRendering = false;
            return;
        } else { // Recursive call on three smaller triangles
            this.timeouts.push(setTimeout(() => {
                this.sierpinskiTriangle(iteration, newTriangle1, ctx, animationDelay);
                this.sierpinskiTriangle(iteration, newTriangle2, ctx, animationDelay);
                this.sierpinskiTriangle(iteration, newTriangle3, ctx, animationDelay);
            }, animationDelay))
        }
    }
}

function midpoint(point1, point2) {
    var mid = new Point();
    mid.x = (point1.x + point2.x) / 2;
    mid.y = (point1.y + point2.y) / 2;
    return mid;
}

function clamp(num, min, max) {
    if(num < min) {
        return min;
    } else if(num > max) {
        return max;
    } else {
        return num;
    }
}

function resetCanvasBitmap(canvas) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}