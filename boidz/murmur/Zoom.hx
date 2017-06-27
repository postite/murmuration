package murmur;

import boidz.render.canvas.*;
import boidz.Boid;
import boidz.Flock;
import boidz.IRenderable;
import boidz.Point;
import thx.Ints;
import thx.color.Rgb;
import thx.color.Rgba;
import msignal.Signal;



class Zoom implements IRenderable<CanvasRender> {
  public var signal:Signal0; 
  var flock : Flock;
  public var enabled : Bool = true;
  public var renderCentroid : Bool = #if debug true #else false #end;
  public var renderTrail : Bool = false;
  public var trailLength : Int = 20;
  var boidColor : String;
  var crownColor : String;
  var trailColor : String;

  var map : Map<Boid, Array<Point>>;
  public function new(flock : Flock, ?boidColor : Rgba, ?crownColor : Rgba, ?trailColor : Rgba) {
    this.boidColor = null == boidColor ? "#000000" : boidColor;
    this.crownColor = null == crownColor ? "rgba(255,255,255,100)" : crownColor;
    this.trailColor = null == trailColor ? (this.boidColor : Rgb).withAlpha(20) : trailColor;

    this.flock = flock;
    this.map = new Map();
    signal= new Signal0();
  }

  function getTrail(b : Boid) {
    var c = map.get(b);
    if(c == null) {
      c = [for(i in 0...trailLength) { x : b.x, y : b.y }];
      map.set(b, c);
    }

    while(c.length < trailLength)
      c.push({ x : b.x, y : b.y });

    if(c.length > trailLength)
      c.splice(trailLength, c.length - trailLength);

    c[pos].x = b.x;
    c[pos].y = b.y;

    return c;
  }

  var pos = 0;
  var zoomFactor=1.0;
  var _newH:Float;
  var _newW:Float;
  public function render(render : CanvasRender) {
    var ctx = render.ctx;

    //ctx.imageSmoothingEnabled=true;

    // boidz
    // z-sorting
    flock.boids.sort(function(a:Boid,b:Boid){
      return Reflect.compare(a.y, b.y) ;
    });

    for(b in flock.boids) {

      //b.d += boidz.util.Steer.away(b, {x:ctx.canvas.width/2,y:ctx.canvas.height/2}, 200);
    
    //count=count%8;
    var im= b.image;
    //find canvas height >
    
    var yFactor=(b.y/ctx.canvas.height)+0.5; // to expose
    var opacity=yFactor;
   // ctx.globalAlpha = opacity;
    zoomFactor=zoomFactor+0.1;
    var wratio=im.width/im.height;
    var newH=300*yFactor;
    var newW=newH*wratio;

    if( _newH<ctx.canvas.height*2){
    _newH=newH+(zoomFactor);
    _newW=_newH*wratio;
    
    }else{
      signal.dispatch();
    }
    //try{
   ctx.drawImage(im,b.x-(_newW/2),b.y-(_newH),_newW,_newH);
    // }catch(msg:Dynamic){
    //   im=b.peopleImage.render();
    //   ctx.drawImage(im,b.x-(newW/2),b.y-(newH/2),newW,newH);
    // }
    }

    // render centroid
    if(renderCentroid) {
      ctx.beginPath();
      ctx.fillStyle = "#cc3300";
      ctx.arc(flock.x, flock.y, 4, 0, 2 * Math.PI, false);
      ctx.fill();
    }
  }
}
