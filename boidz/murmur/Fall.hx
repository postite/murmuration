package murmur;
import murmur.DoneSignal;
import boidz.IFlockRule;
import thx.unit.angle.Degree;
import boidz.render.canvas.ZoneBounds;
import boidz.util.Steer;
import boidz.*;
import boidz.rules.*;
import msignal.Signal;
class Fall implements IFlockRule {
  public var flock : Flock;
  public var goal : SteerTowardGoal;
  public var enabled : Bool = true;
  public var maxSteer : Float;
  public var signal:Signal0; 
  var zone:ZoneBounds;
  var map:Map<Boid,Point>= new Map();
 public var points:Array<Point>=[];
  // move 1% toward the perceived center of all other boids
  public function new(flock:Flock,zone:ZoneBounds, ?maxSteer : Degree) {
    if(null == maxSteer)
      maxSteer = 10;
    this.flock = flock;
    this.zone=zone;
    for (b in flock.boids){
      var p:Point={x:zone.minx+(Math.random()*zone.maxx),y:zone.miny+(Math.random()*zone.maxy)}
      points.push(p);
      map.set(b,p);
    }

    signal= new Signal0();
    //this.goal = new SteerTowardGoal(flock.x, flock.y, maxSteer);
  }

  public function before() {
    //goal.x = zone.minx+(Math.random()*zone.maxx);

    //goal.y = zone.miny+(Math.random()*zone.maxy);
    return true;
  }
  var done=new Map<Boid,Bool>();
  var count=0;
  var go=true;
  var run=true;
  var no=false;


   public function modify(b:Boid){
    b.d += Steer.toward(b, {x:b.x,y:zone.maxy+100}, 2);
      if( b.y>zone.maxy)
        flock.boids.remove(b);

      if (flock.boids.length==0)
        signal.dispatch();
    }

    function doit(){
      no=true;
      // DoneSignal.getInstance().dispatch();
    }

    function gof(b:boidz.Boid){
     // go=false;
      
      var t=haxe.Timer.delay(function(){
        
        //trace( "after delay");
        //go=true;
        run=false;
      },3000);
    }
    //goal.modify(b);
}