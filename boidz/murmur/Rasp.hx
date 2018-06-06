package murmur;

import boidz.Boid;
import boidz.Display;
import boidz.Flock;
import boidz.rules.*;
import boidz.render.canvas.*;
using thx.Arrays;
using thx.Floats;
import thx.color.Rgb;

import js.Browser;
import thx.Timer;
import murmur.MurmurTools;
import murmur.People;
import js.Browser.*;
import murmur.scenarios.*;

class Rasp{

  /// dimensions
  
  public var scenario:Scenario;
  public var walk:Walk;
  public var width  = #if nico 1600 #else 1440 #end;
  public var height = 900;
  public var clientID:Int;

  //storing velocityfunction
  static var velocityfunc;
  var DS:murmur.DoneSignal;
  

  static var paused = 0;

  //boidz specific
  public var velocity=0.9;
  static var _numPeople=20;
  
  public var randomVelocity:Bool=true;
  public var flock:Flock;
  public var canvas:js.html.CanvasElement;
  public var render:boidz.render.canvas.CanvasRender;
  public var display:Display<boidz.render.canvas.CanvasRender>;
  public var avoidCollisions:boidz.rules.AvoidCollisions;
  public var respectBoundaries:boidz.rules.RespectBoundaries;
  public var waypoints:boidz.rules.IndividualWaypoints;
  public var canvasBoundaries:boidz.render.canvas.CanvasBoundaries;
  public var canvasWaypoints:boidz.render.canvas.CanvasIndividualWaypoints;
  public var canvasFlock:boidz.IRenderable<CanvasRender>;
  public var zoneBounds:boidz.render.canvas.ZoneBounds;
  public var zone:boidz.rules.SteerTowardZone;
  public var steerCenter:SteerTowardCenter;
  public var split:murmur.SplitBoundaries;
  public var debugRender:boidz.render.canvas.DebugRender;
  
  // signal for Timed Scenario
  



  //listening to Sockets
  public function new(){
    var sok=new socket.SocketManager();
    sok.connected.addOnce(execute);
  }

  public static function main(){
    new Rasp();
  }

  public  function execute(dims:{width:Int,height:Int,clientID:Int}) {
    width=dims.width;
    height=dims.height;
    clientID=dims.clientID;

    //activate pausing
    spaceKeydown(toggleDebug);

    //listen to reload
    DS= DoneSignal.getInstance();
    // DS.add(timed);

    //activate reload
    //haxe.Timer.delay(timed,60000);
 
     flock  = new Flock();
     canvas = getCanvas();
     
     render = new CanvasRender(canvas);
     debugRender=new DebugRender(getDebugContainer());
      debugRender.clientID=dims.clientID;
    //debugDisplay= ;
    //add a new Canvas
    
     display = new Display(render);
     var debugDisplay= new Display(debugRender);
     debugDisplay.render();
     DS.add(function(scenario:String,val:String){
      debugRender.actionID=val;
      debugRender.peopleID=flock.boids.length;
      debugRender.scenarioID=scenario;
      debugDisplay.render();
    });
    // display.addRenderable(new CanvasBoundaries()
     avoidCollisions = new AvoidCollisions(flock, 100, 25);
     respectBoundaries = new RespectBoundaries(-300, width+300, -300, height+300, 50, 25);
     waypoints = new IndividualWaypoints(flock, 10);
     //velocity = _velocity;

   // split= new SplitBoundaries(0, width, 0, height);
     //flock.addRule(split);
     murmur.SplitBoundaries.outBounds.add(removeBoid);
        


    //RULES
    
    steerCenter=new SteerTowardCenter(flock);
    flock.addRule(steerCenter);
    steerCenter.enabled=false;
    flock.addRule(waypoints);
    waypoints.enabled=false;
    flock.addRule(avoidCollisions);
    avoidCollisions.enabled=false;
    flock.addRule(respectBoundaries);
    respectBoundaries.enabled=true;
    //respectBoundaries.enabled=false;
    addBoids(flock, _numPeople, velocity, respectBoundaries.offset);

    canvasBoundaries = new CanvasBoundaries(respectBoundaries);
    canvasWaypoints = new CanvasIndividualWaypoints(waypoints);
    canvasFlock = new People(flock);
    //canvasFlock = new CanvasFlock(flock);
    
    // Walk.outBounds.add(walk.back);
    zoneBounds= new ZoneBounds(new RespectBoundaries(20+Math.random()*width, 30+Math.random()*height, 30+Math.random()*300, 40+Math.random()*600, 50, 25));

    zone= new SteerTowardZone(flock,zoneBounds);
   // flock.addRule(zone);
   // display.addRenderable(new boidz.render.canvas.TargetZone(zone.points));
    display.addRenderable(canvasBoundaries);
    #if debug display.addRenderable(canvasWaypoints);#end
    display.addRenderable(canvasFlock);
    
    #if debug display.addRenderable(zoneBounds);#end
    

    canvas.addEventListener("click", function(e) {
      waypoints.addGoal(e.clientX, e.clientY);
    }, false);

    var residue = 0.0,
        step    = flock.step * 1000,
        renderings = [];
  #if ui
    var benchmarks = [],
        frames = [],      
        execution = null,
        rendering = null,
        frameRate = null,
  #end
      var start = Timer.time();

    thx.Timer.frame(function(delta) {
      delta += residue;
      while(delta - step >= 0) {

        flock.update();

        #if ui
        var time = Timer.time();
        benchmarks.splice(1, 10);
        benchmarks.push(Timer.time() - time);
        #end 

        delta -= step;
      }

      residue = delta;
      var before = Timer.time();
      display.render();
      renderings.splice(1, 10);
      renderings.push(Timer.time() - before);
      #if ui
      var n = Timer.time();
      frames.splice(1, 10);
      frames.push(n - start);
      start = n;
      #end
    });


    // thx.Timer.repeat(function() {
    //   var average = benchmarks.average().roundTo(2),
    //       min     = benchmarks.min().roundTo(2),
    //       max     = benchmarks.max().roundTo(2);
    //   execution.set('$average ($min -> $max)');

    //   average = renderings.average().roundTo(1);
    //   min     = renderings.min().roundTo(1);
    //   max     = renderings.max().roundTo(1);
    //   rendering.set('$average ($min -> $max)');

    //   min     = (1000 / frames.min()).roundTo(1);
    //   max     = (1000 / frames.max()).roundTo(1);
    //   frameRate.set('$average/s ($min -> $max)');
    // }, 2000);

    #if (debug && ui)
    // var ui = new UI(display,flock,addBoids,velocity,respectBoundaries,avoidCollisions,canvasBoundaries,width,height,waypoints,canvasWaypoints,
    //   cast execution,
    //   cast rendering,
    //   cast frameRate);
    var ui= new UI(this);
    
 #end
    
      
    
    
    //
    //
    //
    //scenario= new Scenario(this,clientID);
    //scenario.init();
    // wait(dims.clientID);
     trace( "all OK");
   
      
  }


  public function reset(){
    addBoids(flock,_numPeople,1,0);
  }



  

  /*listening to sockets
  ----------------------*/
  function wait(state:Int){

    socket.SocketManager.walkSignal.add(function(dir,sprite:murmur.Sprite){
      if (walk.gone)return;
      #if debug changeAnyColor();#end 
      trace('state=$state spriteState=${sprite.state}');
      display.removeRenderable(walk);
      walk.enabled=false;

      if(state!=sprite.state){
      //var people= People.fromLight(p);
      walk.setState(state);
      display.addRenderable(walk);
     
      switch (dir) {
        case "left":walk.back(dir,sprite);
        case "right":walk.back(dir,sprite);
      }
       walk.enabled=true;
      // peoples.push(people);
      // people._in();
      
      }

    });
    socket.SocketManager.emitSignal.add(function(dir,boid:Boid){
      //trace("new"+state);
      if(state!=boid.state){
      //var people= People.fromLight(p);
      boid.state=state;
      
      switch (dir) {
        case "left":boid.x=width;
        case "right":boid.x=0;
      }
      
      // peoples.push(people);
      // people._in();
      addBoid(boid);
      }

      

    });
    
    //CanvasClient.People.signal.add(fire);
  }

  
 
  public function changeAnyColor(){
    changeColor("#"+StringTools.hex(
        Std.int(Math.random()
        * 0xFFFFFF ))
      );
  }
  public function changeColor(color:String){
    #if debug
    var rgb:Rgb=color;
    var lightcolor= rgb.lighter(.95);
    js.Browser.document.body.style.backgroundColor=lightcolor.toHex();
    #end
  }

  /*___________end sockets________*/

  
  
  //---------------
  // Boid utilities
  //---------------
  public function addBoids(flock : Flock, howMany : Int, velocity : Float, offset : Float) {
    var w = Math.min(width, height);
    for (i in 0...howMany) {
      // create a new boid and add it to the stage
      var b = new Boid(
            offset + (width - offset * 2) * Math.random(),
            offset+ ( offset * 2),
            velocity,
            Math.random() * 400);
      // adding a state 
      b.state=clientID;

      flock.boids.push(b);
    }
  }
  
  function addBoid(b:Boid){
   // trace( "addBoid in"+ b.peopleImage.path);
    var img = new js.html.Image();
      img.src = b.peopleImage.path;
      img.onload=function(e){
        var i:js.html.Image= e.target;
        b.image=i;
        flock.boids.push(b);
        //trace( 'w=${i.width} h=${i.height}');
      }

      debugRender.peopleID=flock.boids.length;
    

  }

  function removeBoid(dir:String,b:Boid){
    flock.boids.remove(b);
    debugRender.peopleID=flock.boids.length;
  }

  /*________________*/

  // realTime velocity update
  public function updateVelocity() {
      for(boid in flock.boids)
        boid.v = velocity * (randomVelocity ? Math.random()*2 : velocity);
  }


   // just find the canvas on htmlPage
   function getCanvas() {
    var canvas = Browser.document.createCanvasElement();
    canvas.width = width;
    canvas.height = height;
    Browser.document.body.appendChild(canvas);
    return canvas;
  }

  function getDebugContainer(){
    var container=Browser.document.createDivElement();
    Browser.document.body.appendChild(container);
    return container;
  }

   //pausing onspaceBAr
  static function pause(){
    velocityfunc(paused);
    if( paused==0)paused=1
      else
      paused=0; 
  }
  public function toggleDebug(){
    debugRender.toggle();
  }
  //listening spaceBar
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
}