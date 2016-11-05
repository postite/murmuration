package murmur;

import boidz.Boid;
import boidz.Display;
import boidz.Flock;
import boidz.rules.*;
import boidz.render.canvas.*;
using thx.Arrays;
using thx.Floats;

import js.Browser;
import thx.Timer;
import murmur.MurmurTools;
import murmur.People;

class Canvas {

  /// dimensions
  public var width  = 1900;
  public var height = 1000;

  //storing velocityfunction
  static var velocityfunc;
  
  static var document:js.html.Document= js.Browser.document;

  static var paused = 0;

  //boidz specific
  public var velocity=1.2;
  static var _numPeople=300;
public var randomVelocity:Bool=false;
public var flock:Flock;
public var canvas:js.html.CanvasElement;
public var render:boidz.render.canvas.CanvasRender;
public var display:Display<boidz.render.canvas.CanvasRender>;
public var avoidCollisions:boidz.rules.AvoidCollisions;
public var respectBoundaries:boidz.rules.RespectBoundaries;
public var waypoints:boidz.rules.IndividualWaypoints;
public var canvasBoundaries:boidz.render.canvas.CanvasBoundaries;
public var canvasWaypoints:boidz.render.canvas.CanvasIndividualWaypoints;
public var canvasFlock:People;
public var zoneBounds:boidz.render.canvas.ZoneBounds;
public var zone:boidz.rules.SteerTowardZone;

  //pausing onspaceBAr
  static function pause(){
    velocityfunc(paused);
    if( paused==0)paused=1
      else
      paused=0; 
  }

  public var DS:murmur.DoneSignal;

  static function spaceKeydown(callback:Void->Void){
     document.addEventListener("keydown", function(e) {
  if (e.keyCode == 13) {
    callback();
  }
}, false);
  }

  //reload every ...
  static  function timed(){
     js.Browser.location.reload();
  }
  public function new(){
    execute();
  }

  public static function main(){
    new Canvas();
  }

  public  function execute() {

  //activate pausing
  spaceKeydown(pause);

  //listen to reload
  DS= DoneSignal.getInstance();
 // DS.add(timed);

  //activate reload
  //haxe.Timer.delay(timed,60000);
 

        flock  = new Flock();
        canvas = getCanvas();
        render = new CanvasRender(canvas);
        display = new Display(render);
        avoidCollisions = new AvoidCollisions(flock, 3, 25);
        respectBoundaries = new RespectBoundaries(-300, width+300, -300, height+300, 50, 25);
        waypoints = new IndividualWaypoints(flock, 10);
        //velocity = _velocity;


    //flock.addRule(new SteerTowardCenter(flock));
    flock.addRule(waypoints);
    flock.addRule(avoidCollisions);
    flock.addRule(respectBoundaries);
    
    addBoids(flock, _numPeople, velocity, respectBoundaries.offset);

    canvasBoundaries = new CanvasBoundaries(respectBoundaries);
    canvasWaypoints = new CanvasIndividualWaypoints(waypoints);
    canvasFlock = new People(flock);
    zoneBounds= new ZoneBounds(new RespectBoundaries(20+Math.random()*800, 30+Math.random()*600, 30+Math.random()*300, 40+Math.random()*600, 50, 25));

    zone= new SteerTowardZone(flock,zoneBounds);
    //flock.addRule(zone);
   // display.addRenderable(new boidz.render.canvas.TargetZone(zone.points));
   // display.addRenderable(canvasBoundaries);
    #if debug display.addRenderable(canvasWaypoints);#end
    display.addRenderable(canvasFlock);
    //display.addRenderable(zoneBounds);
    





    canvas.addEventListener("click", function(e) {
      waypoints.addGoal(e.clientX, e.clientY);
    }, false);

    
    var benchmarks = [],
        frames = [],
        renderings = [],
        residue = 0.0,
        step    = flock.step * 1000,
        execution = null,
        rendering = null,
        frameRate = null,

        start = Timer.time();

    thx.Timer.frame(function(delta) {
      delta += residue;
      while(delta - step >= 0) {

        var time = Timer.time();
        flock.update();
        benchmarks.splice(1, 10);
        benchmarks.push(Timer.time() - time);

        delta -= step;
      }
      residue = delta;
      var before = Timer.time();
      display.render();
      renderings.splice(1, 10);
      renderings.push(Timer.time() - before);

      var n = Timer.time();
      frames.splice(1, 10);
      frames.push(n - start);
      start = n;
    });


    thx.Timer.repeat(function() {
      var average = benchmarks.average().roundTo(2),
          min     = benchmarks.min().roundTo(2),
          max     = benchmarks.max().roundTo(2);
      execution.set('$average ($min -> $max)');

      average = renderings.average().roundTo(1);
      min     = renderings.min().roundTo(1);
      max     = renderings.max().roundTo(1);
      rendering.set('$average ($min -> $max)');

      min     = (1000 / frames.min()).roundTo(1);
      max     = (1000 / frames.max()).roundTo(1);
      frameRate.set('$average/s ($min -> $max)');
    }, 2000);

    #if debug
    // var ui = new UI(display,flock,addBoids,velocity,respectBoundaries,avoidCollisions,canvasBoundaries,width,height,waypoints,canvasWaypoints,
    //   cast execution,
    //   cast rendering,
    //   cast frameRate);
    var ui= new UI(this);
    DS.dispatch();
 #end

    var scenario= new Scenario(this,2000
      );

    //new crowded.Crowd();
  }

   function getCanvas() {
    var canvas = Browser.document.createCanvasElement();
    canvas.width = width;
    canvas.height = height;
    Browser.document.body.appendChild(canvas);



    return canvas;
  }

  public function addBoids(flock : Flock, howMany : Int, velocity : Float, offset : Float) {
    var w = Math.min(width, height);
    for (i in 0...howMany) {
      // create a new boid and add it to the stage
      var b = new Boid(
            offset + (width - offset * 2) * Math.random(),
            offset + (height - offset * 2) * Math.random(),
            velocity,
            Math.random() * 360);
      flock.boids.push(b);
    }
  }

  public function updateVelocity() {
      for(boid in flock.boids)
        boid.v = velocity * (randomVelocity ? Math.random() : velocity);
    }
}