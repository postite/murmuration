package boidz.rules;
import murmur.DoneSignal;
import boidz.IFlockRule;
import thx.unit.angle.Degree;
import boidz.render.canvas.ZoneBounds;
import boidz.util.Steer;
class SteerTowardZone implements IFlockRule {
  public var flock : Flock;
  public var goal : SteerTowardGoal;
  public var enabled : Bool = true;
  public var maxSteer : Float;
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
    if(no)return ;
    if( count> 10) doit();


    if(go)
    b.d += Steer.toward(b, map.get(b), maxSteer);

   
    //trace( "yo" +b.x);
    if(!done.get(b)){
    if(Math.round(b.y)==Math.round(map.get(b).y) && Math.round(b.x)==Math.round(map.get(b).x) ){
      done.set(b,true);
      count++;
     // gof(b);
      b.v=0;
      
       // b.d += Steer.away(b, cast this, maxSteer);
    }}else{


    
      
        //b.v=2;
      //b.d+=3;
      
       // b.d+= Steer.away(b, goal, 1);
        // goal.modify(b);
    }
    
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