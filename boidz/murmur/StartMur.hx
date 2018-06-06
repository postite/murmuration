package murmur;
import boidz.Boid;
import boidz.Flock;
import boidz.render.canvas.*;
import boidz.rules.*;
import js.Browser.*;
import thx.color.Rgb;

interface StartMur{
	public var width  = #if nico 1600 #else 1353 #end;
	public var velocity	:Float=0.9;
	public var height = 649;
	public var walk:Walk;
	public var flocks:Array<Flock>;
	
	public var randomVelocity:Bool=true;
	public var respectBoundaries:boidz.rules.RespectBoundaries;
	public var canvasFlock:boidz.IRenderable<CanvasRender>;
	public var debugRender:boidz.render.canvas.DebugRender;
	public var flock:Flock;
	public var avoidCollisions:boidz.rules.AvoidCollisions;
	public var waypoints:boidz.rules.IndividualWaypoints;
	public var zoneBounds:boidz.render.canvas.ZoneBounds;
	public var zone:boidz.rules.SteerTowardZone;
	public var display:boidz.Display<boidz.render.canvas.CanvasRender>;
	public function updateVelocity():Void;
	public function addBoidsInBounds(flock : Flock, howMany : Int, velocity : Float,bounds:RespectBoundaries,?type:BoidType):Void;
	public function addBoids(flock : Flock, howMany : Int, velocity : Float, offset : Float,?type:BoidType):Void;
	public  function toggleDebug():Void;
	public function changeAnyColor():Void;
	public var steerCenter:SteerTowardCenter;
	public var split:murmur.SplitBoundaries;
	public function changeColor(color:String):Void;

}


class Mur implements StartMur{
	public var maxBoidz:Int=400;
	public var width:Int;
	public var velocity	:Float;
	public var height:Int;
	public var walk:Walk;
	public var flocks:Array<Flock>=[];
	public  var CLI:Int=1;
	public  var velocityfunc:Dynamic;
	public  var paused = 0;
	public var randomVelocity:Bool;
	public var respectBoundaries:boidz.rules.RespectBoundaries;
	public var canvasFlock:boidz.IRenderable<CanvasRender>;
	public var debugRender:boidz.render.canvas.DebugRender;
	public var flock:Flock;
	public var avoidCollisions:boidz.rules.AvoidCollisions;
	public var waypoints:boidz.rules.IndividualWaypoints;
	public var zoneBounds:boidz.render.canvas.ZoneBounds;
	public var zone:boidz.rules.SteerTowardZone;
	public var display:boidz.Display<boidz.render.canvas.CanvasRender>;
	public var steerCenter:SteerTowardCenter;
	public var split:murmur.SplitBoundaries;
	// realTime velocity update
  public function updateVelocity() {
      for(boid in flock.boids)
        boid.v = velocity * (randomVelocity ? Math.random()*2 : velocity);
  }
public function addBoidsInBounds(flock : Flock, howMany : Int, velocity : Float,bounds:boidz.rules.RespectBoundaries,?type:BoidType) {
    //var w = Math.min(bounds.width, bounds.height);
    for (i in 0...howMany) {
      // create a new boid and add it to the stage
      var b = new Boid(
            bounds.minx+Math.random()*bounds.maxx,
            bounds.miny+Math.random()*bounds.maxy,
            velocity,
            0);
            //Math.random() * 400);
      // adding a state 
      b.type=type;
      b.state=CLI;

      flock.boids.push(b);
    }
  } //---------------
  // Boid utilities
  //---------------
  public function addBoids(flock : Flock, howMany : Int, velocity : Float, offset : Float,?type:BoidType) {
    var w = Math.min(width, height);
    for (i in 0...howMany) {
      // create a new boid and add it to the stage
      var b = new Boid(
            offset + (width - offset * 2) * Math.random(),
            offset+ ( offset * 2),
            velocity,
            Math.random() * 400);
      // adding a state 
      b.type=type;
      b.state=CLI;
      if (flock.boids.length<maxBoidz)
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

  public function removeBoid(dir:String,b:Boid){ 	
    flock.boids.remove(b);
    debugRender.peopleID=flock.boids.length;
  }
   public function toggleDebug(){
    debugRender.toggle();
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
    var lightcolor= rgb.lighter(.30);
    js.Browser.document.body.style.backgroundColor=lightcolor.toHex();
    #end
  }

  //pausing onspaceBAr
   function pause(){
    velocityfunc(paused);
    if( paused==0)paused=1
      else
      paused=0; 
  }

  //listening spaceBar
     function spaceKeydown(callback:Void->Void){
     document.addEventListener("keydown", function(e) {

      if (e.keyCode == 13) {

       callback();
      }
      }, false);
    }
  //reload every ...
  public  function timed(){
     js.Browser.location.reload();
  }
	
}