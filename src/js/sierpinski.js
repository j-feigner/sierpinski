window.onload = main;

function main() {
    var app = new FractalGenerator();
    app.setRenderScale(4);
    app.start("sierpinski");
/* 
    c.addEventListener("wheel", (event) => {
        scrollValue -= event.deltaY * 0.0001;

        zoomRatio = Math.round((1 + scrollValue) * 100) / 100;

        scrollValueDisplay.innerHTML = zoomRatio;
    })
    c.addEventListener("mousedown", (event) => {
        is_dragging = true;

        dragStartX = event.offsetX;
        dragStartY = event.offsetY;

        draggingDisplay.innerHTML = is_dragging;
    })
    c.addEventListener("mousemove", (event) => {
        if(is_dragging) {
            dragDiffX = event.offsetX - dragStartX;
            dragDiffY = event.offsetY - dragStartY;

            view.originX += dragDiffX;
            view.originY += dragDiffY;

            dragStartX = event.offsetX;
            dragStartY = event.offsetY;

            viewXValueDisplay.innerHTML = view.originX;
            viewYValueDisplay.innerHTML = view.originY;

            ctx.clearRect(0, 0, c.width, c.height);
            ctx.drawImage(renderingCanvas, view.originX, view.originY, 1920, 1080);
            ctx.stroke();
        }
    })
    c.addEventListener("mouseup", () => {
        is_dragging = false;

        draggingDisplay.innerHTML = is_dragging;
    }) */
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
    this.renderingCanvas.width = window.innerWidth;
    this.renderingCanvas.height = window.innerHeight;

    this.renderingCtx = this.renderingCanvas.getContext("2d");

    this.view = new FractalViewport();

    this.display = new FractalGeneratorDisplay();

    this.setRenderScale = function(scaleFactor) {
        this.renderingCanvas.width *= scaleFactor;
        this.renderingCanvas.height *= scaleFactor;
    }

    this.start = function(option) {
        if(option === "sierpinski") {
            // Line style settings for triangle
            this.renderingCtx.lineWidth = 1;
            this.renderingCtx.strokeStyle = "black";
    
            // Create initial points of outer triangle
            var centerX = this.renderingCanvas.width / 2;
            var centerY = this.renderingCanvas.height / 2;

            var point1 = new Point(this.renderingCanvas.width / 2, 0);
            var point2 = new Point((this.renderingCanvas.width + this.renderingCanvas.height) / 2, this.renderingCanvas.height);
            var point3 = new Point((this.renderingCanvas.width - this.renderingCanvas.height) / 2, this.renderingCanvas.height);
            var outerTriangle = new Triangle(point1, point2, point3);

            // Set iteration count and call recursive function to draw to rendering canvas
            var iterations = 12;
            this.sierpinskiTriangle(iterations, outerTriangle, this.renderingCtx);
            this.renderingCtx.stroke();
    
            // Draw scaled image of rendering canvas to display canvas
            this.view.displayCtx.drawImage(this.renderingCanvas, 0, 0, this.view.rect.w, this.view.rect.h);
        } else {
            alert("BAD");
            return;
        }
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

function FractalViewport() {
    this.rect = new Rectangle(0, 0, window.innerWidth, window.innerHeight);

    this.displayCanvas = document.getElementById("fractalCanvas");
    this.displayCtx = this.displayCanvas.getContext("2d");

    this.zoom = 1.0;
    this.scrollX = 0.0;
    this.scrollY = 0.0;

    this.is_dragging = false;

    this.displayCanvas.width = this.rect.w;
    this.displayCanvas.height = this.rect.h;
}

function FractalGeneratorDisplay() {
    this.zoomDisplay = document.getElementById("scrollValue");
    this.scrollXDisplay = document.getElementById("viewXValue");
    this.scrollYDisplay = document.getElementById("viewYValue");
    this.dragDisplay = document.getElementById("draggingValue");

    this.zoomDisplay.innerHTML = "ZOOM";
    this.scrollXDisplay.innerHTML = "SCROLL X";
    this.scrollYDisplay.innerHTML = "SCROLL Y";
    this.dragDisplay.innerHTML = "DRAG BOOL";
}

function midpoint(point1, point2) {
    var mid = new Point();
    mid.x = (point1.x + point2.x) / 2;
    mid.y = (point1.y + point2.y) / 2;
    return mid;
}