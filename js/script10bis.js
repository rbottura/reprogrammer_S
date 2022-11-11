var json_data;
fetch("./json_data.json")
    .then(response => response.json())
    .then(jsondata => json_data = jsondata);

setTimeout(function () {
    console.log(json_data);
}, 1000)

Matter.use(MatterAttractors);

let WiW = window.innerWidth, WiH = window.innerHeight;

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Events = Matter.Events,
    Composites = Matter.Composites,
    Common = Matter.Common,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Body = Matter.Body,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create engine
var engine = Engine.create(), world = engine.world;
let canvas_1 = document.getElementById("canvas_1");
let ctx = canvas_1.getContext("2d");
let speed1 = 0.2;

canvas_1.width = WiW;
canvas_1.height = WiH;

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    canvas: canvas_1,
    context: ctx,
    options: {
        width: WiW,
        height: WiH,
        showAngleIndicator: false,
        wireframes: false,
        background: 'rgb(255,255,255)'
    }
});

Render.run(render);

engine.world.gravity.y = 0;

var attractiveBody = Bodies.circle(
    render.options.width / 2,
    render.options.height / 2,
    2,
    {
        isStatic: true,
        collisionFilter: {
            category: mouseCategory,
            group: -1
        },
        // example of an attractor function that 
        // returns a force vector that applies to bodyB
        plugin: {
            attractors: [
                function (bodyA, bodyB) {
                    return {
                        x: (bodyA.position.x - bodyB.position.x) * 0.5e-3,
                        y: (bodyA.position.y - bodyB.position.y) * 0.5e-3,
                    };
                }
            ]
        }
    });

World.add(world, attractiveBody);

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            // allow bodies on mouse to rotate
            angularStiffness: 0,
            render: {
                visible: false
            }
        }
    });

Events.on(engine, 'afterUpdate', function () {
    if (!mouse.position.x) {
        return;
    }
    // smoothly move the attractor body towards the mouse
    Body.translate(attractiveBody, {
        x: (mouse.position.x - attractiveBody.position.x) * 0.25,
        y: (mouse.position.y - attractiveBody.position.y) * 0.25
    });
});


var ballsCategory = 0x0001,
    mouseCategory = 0x0002;

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

document.addEventListener("keydown", showLetter);

var shuffArray;
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    shuffArray = array;
}

function showLetter(e) {
    let keyP = e.keyCode - 65;
    var arr = json_data[keyP];

    shuffle(arr);
    console.log(arr);

    if (keyP >= 0 && keyP < 26) {
        creaParticules(keyP);
    }
}

bodiz2 = [];
conz = [];
//jaune #F0ce2F
//bleu foncé #3187b6

var textBalls = document.getElementById("textBalls");
var posBalls = 1;

var index_cnt = 0;

//création des particules fix et mouvantes
function creaParticules(key, loadingMod) {
    if (index_cnt == 0) {

        if (loadingMod == "slow") {

        } else if (loadingMod == "fast") {

        } else if (loadingMod == "none") {

        }

        for (var i = 0; i < 180; i++) {
            //json_data possède une hiérarchie à 3 niveaux tel que : 26 lettres --> 180 paires de coordonnées --> 2 valeurs (coordonnées x et y) 
            var body = Bodies.circle((json_data[key][i][0] / posBalls) + 100, (json_data[key][i][1] / posBalls) + 25, 25, {
                render: {
                    fillStyle: "rgba(0,0,0,0)",
                    // fillStyle: "rgba(220,220,220,1)",
                    sprite: {
                        // texture: textBalls.src,
                        xScale: 0.1,
                        yScale: 0.1,
                    }
                }
            });
            body.density = 1;
            body.frictionAir = 0.01;
            body.collisionFilter.category = ballsCategory;
            body.collisionFilter.group = -1;
            body.restitution = 0.9;
            //body.render.sprite.texture = "./../textBalls.png";

            bodiz2.push(body);

            var constraint = Constraint.create({
                pointA: { x: json_data[key][i][0] / posBalls + 100, y: json_data[key][i][1] / posBalls },
                bodyB: body,
                pointB: { x: 0, y: 0 },
                stiffness: 1,
                damping: 0.1,
                // length:350,
            })
            conz.push(constraint);
            constraint.render.strokeStyle = "rgba(0,152,0,0.9)";
            World.add(world, [body, constraint]);
            index_cnt = 1;
        }
    } else {
        console.log("tootot");
         let replace = 0;
         let freplace = setInterval(function () {
             console.log("boboub");
             //conz[replace].pointA.x = easeIn(conz[replace].pointA.x, shuffArray[replace][0], speed1);
             //conz[replace].pointA.y = easeIn(conz[replace].pointA.y, shuffArray[replace][1], speed1);
             conz[replace].pointA.x = shuffArray[replace][0];
             conz[replace].pointA.y = shuffArray[replace][1];
             //bodiz2[replace].pointA.x = shuffArray[replace][0];
             //bodiz2[replace].pointA.y = shuffArray[replace][1];
             //bodiz2[replace].frictionAir = 0.8;
             replace++;
             if (replace == 180) {
                 clearInterval(freplace)
             }
         }, 6)

        //for (let i = 0; i < 180; i++) {
        //    conz[i].pointA.x = shuffArray[i][0] + 100;
        //    conz[i].pointA.y = shuffArray[i][1];
        //}
    }
}

function easeIn(from, to, ease) {
    return from + (to - from) * ease;
}

document.addEventListener("click", function () {
    //Matter.Composite.remove(world, constraint);
    for (var i = 0; i < conz.length; i++) {
        Matter.Composite.remove(world, conz[i]);
        bodiz2[i].render.fillStyle = "red";
        bodiz2[i].collisionFilter.group = -1;
        bodiz2[i].frictionAir = 0.001;
    }
    Matter.Composite.remove(world, attractiveBody);
    engine.world.gravity.y = 1;
    engine.world.gravity.x = -0.35;
    //world.gravity.scale = 0.001;
})

setTimeout(() => {
    upadateRotation();
}, 3000);
function upadateRotation() {
    for (let i = 0; i < bodiz2.length; i++) {
        let AX = (bodiz2[i].position.x / posBalls);
        let AY = (bodiz2[i].position.y / posBalls);
        let angleRadian = Math.atan2(mouse.position.y - AY, mouse.position.x - AX);
        bodiz2[i].angle = angleRadian + Math.PI * 0.8;
    }
    requestAnimationFrame(upadateRotation);
}

// walls
World.add(world, [
    Bodies.rectangle(WiW / 4, WiH - 110, WiW, 10, { isStatic: true }),
]);

// add mouse control
World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
});


function loadingAnimation() {
    creaParticules(18);
}