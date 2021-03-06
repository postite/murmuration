package murmur;


import thx.unit.time.*;
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
class Lombez extends murmur.StartMur.Mur{

  /// dimensions
  
  public var scenario:Scenario;
  

  public var clientID:Int;
 
  static  public var numClient:Int=2;
  
  var DS:murmur.DoneSignal;
  



  //boidz specific
  static var _numPeople=10;
  static var petitgroupe=5;
  

  public var canvas:js.html.CanvasElement;
  public var render:boidz.render.canvas.CanvasRender;
  public var canvasBoundaries:boidz.render.canvas.CanvasBoundaries;
  public var canvasWaypoints:boidz.render.canvas.CanvasIndividualWaypoints;
  

 
 
  
  // signal for Timed Scenario
  



  //listening to Sockets
  public function new(){
    var sok=new socket.SocketManager();
    sok.connected.addOnce(execute);

  width  = 1900;
  velocity =0.9;
  height = 736;
  
  }

  public static function main(){
    new Lombez();
  }

  public  function execute(dims:{width:Int,height:Int,clientID:Int}) {
    CLI=Std.parseInt(js.Browser.window.location.pathname.substr(-1,1));
    trace( 'cli=$CLI');
    if( CLI==1 ){
      width=1280;
       height=622;
       changeAnyColor();
    
     }
    
    trace( 'path='+js.Browser.window.location.pathname);
    trace( 'origin='+js.Browser.window.location.origin);
    //width=dims.width;
    //height=dims.height;

     
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
      debugRender.clientID=CLI;
    //debugDisplay= ;
    //add a new Canvas
    
     display = new Display(render);
     var debugDisplay= new Display(debugRender);
   

     debugDisplay.render();
     

     DS.add(function(scenario:String,val:String){
      debugRender.actionID=val;
      debugRender.peopleID=flock.boids.length;
      debugRender.scenarioID=scenario;
      debugRender.moduloID=0;
      debugDisplay.render();
    });


    // display.addRenderable(new CanvasBoundaries()
     avoidCollisions = new AvoidCollisions(flock, 100, 25);
     respectBoundaries = new RespectBoundaries(-300, width+300, -300, height+300, 50, 25);
     //respectBoundaries = new RespectBoundaries(100, 100, 100,100);
     waypoints = new IndividualWaypoints(flock, 10);

     //velocity = _velocity;

     
     
      //disable pour overlay tests
    split= new SplitBoundaries(0, width, 0, height);
     flock.addRule(split);
     //mode screen2 screen 
     murmur.SplitBoundaries.outBounds.add(removeBoid);
      // murmur.SplitBoundaries.outBounds.add(function(dir:String,b:Boid){
      //     switch(dir){
      //       case "right":
      //       case "left":
      //     }
      //     addBoid
      //   }
      //   );


    //RULES
    
   steerCenter=new SteerTowardCenter(flock);
   flock.addRule(steerCenter);
   steerCenter.enabled=false;
   flock.addRule(waypoints);
   waypoints.enabled=false;
   flock.addRule(avoidCollisions);
   avoidCollisions.enabled=false;
   flock.addRule(respectBoundaries);

    respectBoundaries.enabled=false;
    
    
    //addBoids(flock, _numPeople, velocity, respectBoundaries.offset);
  

    canvasBoundaries = new CanvasBoundaries(respectBoundaries);

    canvasWaypoints = new CanvasIndividualWaypoints(waypoints);
    

    var over= new murmur.CanOver.Over();
    //var decor = new murmur.Decor(new murmur.Decor.DecorImage(),{width:width,height:height});
    //decor.init();
    //var decor2 = new murmur.Decor(new murmur.Decor.DecorImage(),{width:width,height:height});
    //decor2.init();
     over.drawn.add(function(rec){
         trace("drawn");
      debugRender.affiche("rec="+rec);
    //     var petitflock =new Flock();
    //     flocks.push(petitflock);
    //     var grappe= new murmur.People(petitflock);
    //     var steerCenter=new SteerTowardCenter(petitflock);
    //     petitflock.addRule(steerCenter);
    //     var groupeBounds = new RespectBoundaries(rec.x,rec.width, rec.y,rec.height);
    //     addBoidsInBounds(petitflock, petitgroupe, velocity, groupeBounds);
    //     display.addRenderable(grappe);
     });
    over.enabled=true;
    
    
    // Walk.outBounds.add(walk.back);
    zoneBounds= new ZoneBounds(new RespectBoundaries(20+Math.random()*width, 30+Math.random()*height, 30+Math.random()*300, 40+Math.random()*600, 50, 25));

    zone= new SteerTowardZone(flock,zoneBounds);
    flock.addRule(zone);
   // display.addRenderable(new boidz.render.canvas.TargetZone(zone.points));
   // display.addRenderable(canvasBoundaries);
    #if debug display.addRenderable(canvasWaypoints);#end
    
   // display.addRenderable(decor);
   // display.addRenderable(decor2);
    //display.addRenderable(canvasFlock);
    display.addRenderable(over);

    #if debug display.addRenderable(zoneBounds);#end
    
    /*
    canvas.addEventListener("click", function(e) {
      waypoints.addGoal(e.clientX, e.clientY);
    }, false);
  */
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
        for ( f in flocks)
          f.update();
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
 
   canvasFlock = new People(flock);
    display.addRenderable(canvasFlock);
    if (CLI==0){
    var decScenar = new murmur.DecorScenario(this,CLI,(5:Minute)/5,(20 : Minute).toMillisecond());
    decScenar.listenRemote();
    decScenar.execute();
  }

    if (CLI==1){
      //maxBoidz=50;
      
      addBoids(flock, _numPeople, velocity, respectBoundaries.offset);
   
     scenario= new Scenario(this,CLI);
     scenario.init();
    }
    //
    wait(CLI);
    trace( "all OK");
   
      
  }


  public function reset(){
    addBoids(flock,100,1,0);
  }



  

  /*listening to sockets
  ----------------------*/
  function wait(state:Int){
    //var walkCount:Int=1;
    socket.SocketManager.walkSignal.add(function(dir,sprite:murmur.Sprite){
      if (walk.gone)return;
      #if debug changeAnyColor();#end 
      trace('state=$state spriteState=${sprite.state}');
      display.removeRenderable(walk);
      walk.enabled=false;

var modulo=(sprite.state+1)%3;
if (modulo>numClient)modulo=1;
if (modulo==0)modulo=1;
debugRender.moduloID=modulo;
      //if(modulo!=sprite.state){
      //if(state==1){
      //var people= People.fromLight(p);

      if (modulo==state){
      walk.setState(modulo);
      display.addRenderable(walk);

      switch (dir) {
        case "left":walk.back(dir,sprite);
        case "right":walk.back(dir,sprite);
      }
       walk.enabled=true;
      // peoples.push(people);
      // people._in();
      }
      //}

    });

    socket.SocketManager.emitSignal.add(function(dir,boid:Boid){
      var maxClient=numClient;
      trace("new"+state +"boid-state="+boid.state);
      if(state!=boid.state){
      //var people= People.fromLight(p);
     
      var moduloLeft=(state+1)%2;
      var moduloRight=(state-1)%2;
      if (moduloRight<1)moduloRight=maxClient;
      if (moduloLeft>maxClient)moduloLeft=1;

      trace( "modulo-right="+moduloRight +"modulo-left="+moduloLeft);

      switch (dir){
        case "left":
        if( boid.state==moduloLeft ){
        boid.x=width;
        boid.state=state;
        addBoid(boid);
        }
        case "right":
        if( boid.state==moduloRight ){
        boid.x=0;
        boid.state=state;
        addBoid(boid);
        }
      }
      
      // peoples.push(people);
      // people._in();
      //addBoid(boid);
      }

      

    });
    
    //CanvasClient.People.signal.add(fire);
  }

  
 



  /*___________end sockets________*/

  
  

 
  
 

 

  /*________________*/




   // just find the canvas on htmlPage
   function getCanvas(id:String="can") {
    var canvas = Browser.document.createCanvasElement();
    canvas.width = width;
    canvas.height = height;
    canvas.id=id;
    Browser.document.body.appendChild(canvas);
    return canvas;
  }

  function getDebugContainer(){
    var container=Browser.document.createDivElement();
    Browser.document.body.appendChild(container);
    //container.style.width=width+"px";
    //container.style.height=height+"px";
    return container;
  }

   

  
  //reload every ...
 
}