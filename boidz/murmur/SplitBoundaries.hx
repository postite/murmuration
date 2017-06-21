package murmur;


import boidz.Boid;
import thx.unit.angle.Degree;
import boidz.IFlockRule;
using boidz.util.Steer;
import msignal.Signal;
using thx.Floats;
import socket.signal.SplitOut;

class SplitBoundaries implements IFlockRule {
  //public static var outBounds:Signal2<String,Boid> = new Signal2();
  public static var outBounds:SplitOut= SplitOut.getInstance();
  public var minx : Float;
  public var maxx : Float;
  public var miny : Float;
  public var maxy : Float;
  public var offset : Float;
  public var enabled : Bool = true;
  public var maxSteer : Float;
  public function new(minx : Float, maxx : Float, miny : Float, maxy : Float, ?offset : Float = 0.0, ?maxSteer : Degree) {
    if(null == maxSteer)
      maxSteer = 10;
    this.minx = minx;
    this.maxx = maxx;
    this.miny = miny;
    this.maxy = maxy;
    this.offset = offset;
    this.maxSteer = maxSteer;
    trace( "new split");
  }

  public function before() return true;

  public function modify(b:Boid):Void {

    if (
      (b.x < minx + offset && b.d.facingLeft()) ||
      (b.x > maxx - offset && b.d.facingRight())
    ) {


      if(b.x > maxx - offset && b.d.facingRight())
          outBounds.dispatch("right",b);

      if(b.x < minx + offset && b.d.facingLeft())
          outBounds.dispatch("left",b);



      b.d += maxSteer * Floats.sign(cast b.d);
    }
    if (
      (b.y < miny + offset && b.d.facingUp()) ||
      (b.y > maxy - offset && b.d.facingDown())
    ) {
      //trace( "up or down");
      b.d += maxSteer * Floats.sign(cast b.d);
    }
  }
}
