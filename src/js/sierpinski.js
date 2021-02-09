window.onload = main;

function main() {
    var app = new FractalGenerator();
    app.start("sierpinski");
/* 
    c.addEventListener("wheel", (event) => {
        scrollValue -= event.deltaY * 0.0001;

        zoomRatio = Math.round((1 + scrollValue) * 100) / 100;

        scrollValueDisplay.innerHTML = zoomRatio;
    })*/
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

function FractalGenerator() {
    this.renderingCanvas = document.createElement("canvas");
    this.renderingCtx = this.renderingCanvas.getContext("2d");

    this.displayCanvas = document.getElementById("fractalCanvas");
    this.displayCtx = this.displayCanvas.getContext("2d");

    this.renderScaleFactor = 8;

    this.zoom = 1.0;

    this.viewX = 0.0;
    this.viewY = 0.0;

    this.dragX = 0;
    this.dragY = 0;
    this.isDragging = false;

    this.display = new FractalGeneratorDisplay();

    this.start = function(option) {
        this.displayCanvas.width = window.innerWidth;
        this.displayCanvas.height = window.innerHeight;

        this.renderingCanvas.width = this.displayCanvas.width * this.renderScaleFactor;
        this.renderingCanvas.height = this.displayCanvas.height * this.renderScaleFactor;

        this.createEventListeners();

        if(option === "sierpinski") {
            this.renderSierpinski();
    
            this.draw();
        } else {
            alert("BAD");
            return;
        }
    }

    this.createEventListeners = function() {
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
            this.zoom = clamp(this.zoom, 0.5, 8.0);
            this.display.zoom.innerHTML = "Zoom: " + this.zoom + "x";

            this.viewX = event.offsetX - ((relativeX * this.displayCanvas.width * this.zoom) / this.renderingCanvas.width);
            this.viewY = event.offsetY - ((relativeY * this.displayCanvas.height * this.zoom) / this.renderingCanvas.height);

            //this.renderSierpinski();
            this.draw();
        })
    }

    this.renderSierpinski = function() {
        // Line style settings for triangle
        this.renderingCtx.lineWidth = 0.1;
        this.renderingCtx.strokeStyle = "white";

        // Create initial points of outer triangle
        var centerX = this.renderingCanvas.width / 2;
        var halfSideLength = this.renderingCanvas.height / Math.sqrt(3); 

        var point1 = new Point(centerX, 0);
        var point2 = new Point((this.renderingCanvas.width / 2) + halfSideLength, this.renderingCanvas.height);
        var point3 = new Point((this.renderingCanvas.width / 2) - halfSideLength, this.renderingCanvas.height);
        var outerTriangle = new Triangle(point1, point2, point3);

        // Set iteration count and call recursive function to draw to rendering canvas
        var iterations = 13;
        this.sierpinskiTriangle(iterations, outerTriangle, this.renderingCtx);
        this.renderingCtx.stroke();
    }

    this.draw = function() {
        this.displayCtx.clearRect(0, 0, this.displayCanvas.width, this.displayCanvas.height);
        this.displayCtx.drawImage(this.renderingCanvas, this.viewX, this.viewY, this.displayCanvas.width * this.zoom, this.displayCanvas.height * this.zoom);
    }

    // Recursive function that creates all lines within 
    // sierpinski triangle on a given iteration count.
    this.sierpinskiTriangle = function(iteration, triangle, ctx) {
        // Draw initial triangle given to function
        ctx.moveTo(triangle.point1.x, triangle.point1.y);
        ctx.lineTo(triangle.point2.x, triangle.point2.y);
        ctx.lineTo(triangle.point3.x, triangle.point3.y);
        ctx.lineTo(triangle.point1.x, triangle.point1.y);

        // Calculate midpoints between triangle points
        var midpoint1 = midpoint(triangle.point1, triangle.point2);
        var midpoint2 = midpoint(triangle.point2, triangle.point3);
        var midpoint3 = midpoint(triangle.point3, triangle.point1);

        // Construct 3 smaller triangles from calculated midpoints
        var newTriangle1 = new Triangle(triangle.point1, midpoint1, midpoint3);
        var newTriangle2 = new Triangle(triangle.point2, midpoint1, midpoint2);
        var newTriangle3 = new Triangle(triangle.point3, midpoint2, midpoint3);

        if(--iteration === 0) {
            return;
        } else { // Recursive call on three smaller triangles
            this.sierpinskiTriangle(iteration, newTriangle1, ctx);
            this.sierpinskiTriangle(iteration, newTriangle2, ctx);
            this.sierpinskiTriangle(iteration, newTriangle3, ctx);
        }
    }
}

function FractalGeneratorDisplay() {
    this.zoom = document.getElementById("scrollValue");

    this.zoom.innerHTML = "Zoom: 1.00x";
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