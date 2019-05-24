// const app = new PIXI.Application({
//     autoResize: true,
//     backgroundColor: 0x000000,
//     forceCanvas: true,
//     resolution: devicePixelRatio,
//     antialias: true
// }
// );

// console.log(app.view)
// document.body.appendChild(app.view);
// onPlayVideo()


// function onPlayVideo() {

//     const texture = PIXI.Texture.from('./video/Fallingbuilding.mp4');
//     const videoSprite = new PIXI.Sprite(texture);
//     console.log(videoSprite)
//     videoSprite.width  = app.screen.width;
//     videoSprite.height = app.screen.height;
//     videoSprite.rotate = (Math.PI)/2

//     app.stage.addChild(videoSprite);
// }
let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas"
}

alert(type)
PIXI.utils.sayHello(type)

//Create pixi application
const app = new PIXI.Application({
    autoResize: true,
    backgroundColor: 0x000000,
    forceCanvas: true,
    resolution: devicePixelRatio,
    antialias: true
});

//Create aliases 
let renderer = app.renderer,
    stage = app.stage,
    view = app.view,
    loader = app.loader,
    vw = window.innerWidth,
    vh = window.innerHeight,
    solid = PIXI.Texture.WHITE;

//Add view to DOM
document.body.appendChild(view);

//Load video and call setup();
loader.add("moon", "./video/Fallingbuilding.mp4")
      .load(setup);

//Global variables
let left,
    right,
    startText,
    endText,
    videoSource;

function setup() {
    //Create a video sprite and position it
    let videoTexture = PIXI.Texture.from('./video/Fallingbuilding.mp4');
    let videoSprite = new PIXI.Sprite(videoTexture);
    videoSprite.anchor.set(0.5, 0.5);
    videoSprite.position.set(vw / 2, vh / 3);

    TweenLite.set(videoSprite, {
        pixi: {
            saturation: 100
        }
    });
    TweenLite.to(videoSprite);

    //Set properties for the video element (from the HTML5 Media API)
    videoSource = videoTexture.baseTexture.source;
    videoSource.autoPlay = false;
    videoSource.paused = true;

    //Add a tint and blendMode to the video using a solid sprite
    let overlay = new PIXI.Sprite(solid);
    overlay.width = vw;
    overlay.height = vh;
    overlay.tint = 0x00FF00;
    overlay.blendMode = 4; //Pixi value for OVERLAY
    overlay.alpha = 0.5; //for aesthetic reasons

    //Add sprites to the stage. Note the order. Overlay is on top of the video
    stage.addChild(videoSprite);

    //Create the curtains with two solid sprites 
    left = new PIXI.Sprite(solid),
    right = new PIXI.Sprite(solid);

    left.width = vw / 2;
    left.height = vh;
    left.tint = 0x000000;
    left.position.set(0, 0);

    right.width = vw / 2;
    right.height = vh;
    right.position.set(vw / 2, 0);
    right.tint = 0x000000;

    stage.addChild(left, right);

    let style = new PIXI.TextStyle({
        align: "center",
        fill: "0xFF0000",
        fontFamily: 'Germania One',
        fontSize: 24,
        fontWeight: 400,
        letterSpacing: 4
    });

    //Create text "click to start" and "Thanks for watching!" 
    startText = new PIXI.Text('Click to open curtains', style);
    endText = new PIXI.Text('What the Fuck are you doing', style);

    //Position text
    startText.anchor.set(0.5, 0.5);
    startText.position.set(vw / 2, vh / 3);
    endText.anchor.set(0.5, 0.5);
    endText.position.set(vw / 2, vh / 3);

    //Add text to the stage (top layer)
    stage.addChild(startText, endText);

    app.ticker.add(function (delta) {
        videoSprite.rotation -= 0.01 * delta;
    });

    videoSprite.interactive = true;
    videoSprite.on('pointerdown', function () {
        videoSprite.scale.x *= 1.25;
        videoSprite.scale.y *= 1.25;
    });

    //Make endText invisible
    endText.alpha = 0;

    renderer.render(stage);

    resize();
};

function timeline() {
    let tl = new TimelineMax();
    tl.set(startText, { alpha: 1 }) //initialize startText (visible)
      .set(endText, { alpha: 0 })   //initialize endText (invisible)
      .add(slideCurtain(left, right, -vw / 2, vw), "start") //open curtain and add "start" label for timing
      .to(startText, .5, { alpha: 0 }, "start") //startText disappears a half-sec after curtain opens
      .add(() => { videoSource.play() }, "start") //video plays immediately when curtains open
      .add(slideCurtain(left, right, 0, vw / 2), 10) //curtains close at 8.5 secs in
      .to(endText, .5, { alpha: 1 }, "+=0.5"); //display endText .5 sec after curtains close

    tl.play();
}

function slideCurtain(leftSide, rightSide, leftEndX, rightEndX) {
    let tl = new TimelineMax();
    tl.to(leftSide, 1, { x: leftEndX }, "curtain")
      .to(rightSide, 1, { x: rightEndX }, "curtain")
    return tl;
};

window.addEventListener('touchstart', timeline);
window.addEventListener('click', timeline);

window.addEventListener("resize", resize);

function resize() {
    let ratio = videoSource.width / videoSource.height;
    if (vw / vh >= ratio) {
        w = vw * ratio;
        h = vh;
    } else {
        w = vw;
        h = vh / ratio;
    }
    renderer.width = w;
    renderer.height = h;
    console.log('resize')
    renderer.resize(vw, vh);
};            


