//the Vector2 class holding 2 values based on x and y I.E. positional coordinates, sizing, rotation...
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

//The transform class holds positional and size information
class Transform {
    constructor(element) {
        let objectRect = element.getBoundingClientRect();

        console.log(element)
        console.log("Width: " + objectRect.width + " | height: " + objectRect.height)
        console.log("X: " + objectRect.x + " | Y: " + objectRect.y)

        this.scale = new Vector2(objectRect.width, objectRect.height);
        this.position = new Vector2(objectRect.x, objectRect.y);
    }

    //Recalculates the size and position of the current transform
    UpdatePosition(element) {
        let objectRect = element.getBoundingClientRect();

        this.scale.x = objectRect.width
        this.scale.y = objectRect.height
        this.position.x = objectRect.x
        this.position.y = objectRect.y
    }
}

//The object class holds a transform and a element 
class Object {
    constructor(element) {
        this.element = element;
        this.transform = new Transform(element);
    }

    //Passes in the element so the position of the transform can be updated
    UpdatePosition() {
        this.transform.UpdatePosition(this.element);
    }
}

let ball;
let canvas;
let mousePositionA;
let step;

//Once the window is loaded setup all the variables for the ball dragging application
window.onload = function () {
    ball = new Object(document.getElementById("draggable-ball"));
    canvas = new Object(document.getElementById("canvas"));
    ball.element.onmousedown = ElementOnMouseDown;
    mousePositionA = new Vector2(0, 0);
    step = new Vector2(0, 0);
}

//When the window is resized update the position and sizing of the canvas and the ball
window.addEventListener('resize', function (event) {
    canvas.UpdatePosition();
    ball.UpdatePosition();
}, true);

//A function that gets applied to an elements onmousedown event 
function ElementOnMouseDown(event) {
    event = event || window.event;
    event.preventDefault();

    //Get mouse position
    mousePositionA.x = event.clientX;
    mousePositionA.y = event.clientY;

    //Apply the drag element to
    document.onmousemove = elementDrag;
    document.onmouseup = StopElementDrag;
}

//A Function that gets applied when a
function elementDrag(event) {
    event = event || window.event;
    event.preventDefault();

    //Get the step value between previous mouse position and new mouse position
    step.x = mousePositionA.x - event.clientX;
    step.y = mousePositionA.y - event.clientY;
    mousePositionA.x = event.clientX;
    mousePositionA.y = event.clientY;

    //If the next horizontal position is still within of the bounding box then apply the next position 
    if (InsideBoundingBoxXAxis(ball.transform, step.x))
    {
        ball.element.style.left = (ball.element.offsetLeft - step.x) + "px";
        ball.UpdatePosition();
    }

    //If the next Vertical position is still within of the bounding box then apply the next position 
    if (InsideBoundingBoxYAxis(ball.transform, step.y))
    {
        ball.element.style.top = (ball.element.offsetTop - step.y) + "px";
        ball.UpdatePosition();
    }
}

//Stops the element drag function by removing the existing events
function StopElementDrag() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
}

//Checks if a transforms next step is inside the bounding box horizontally
function InsideBoundingBoxXAxis(transform, step) {
    return transform.position.x - step > canvas.transform.position.x && transform.position.x + transform.scale.x - step < canvas.transform.position.x + canvas.transform.scale.x; 
}

//Checks if a transforms next step is inside the bounding box Vertically
function InsideBoundingBoxYAxis(transform, step) {
    return transform.position.y - step > canvas.transform.position.y && transform.position.y + transform.scale.y - step < canvas.transform.position.y + canvas.transform.scale.y;
}