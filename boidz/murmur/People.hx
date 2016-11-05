package murmur;

import boidz.render.canvas.*;
import boidz.Boid;
import boidz.Flock;
import boidz.IRenderable;
import boidz.Point;
import thx.Ints;
import thx.color.Rgb;
import thx.color.Rgba;

class People implements IRenderable<CanvasRender> {
  var flock : Flock;
  public var enabled : Bool = true;
  public var renderCentroid : Bool = #if debug true #else false #end;
  public var renderTrail : Bool = true;
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
  public function render(render : CanvasRender) {
    var ctx = render.ctx;

    ctx.imageSmoothingEnabled=true;
 

    // boidz trail
    if(renderTrail) {
      pos++;
      if(pos >= trailLength) {
        pos = 0;
      }
      ctx.beginPath();
      ctx.strokeStyle = trailColor;
      var c,
          s = pos + 1;
      if(s == trailLength)
        s = 0;
      for(b in flock.boids) {
        c = getTrail(b);
        if(c.length < 2) continue;
        ctx.moveTo(c[s].x, c[s].y);
        for(i in s...trailLength) {
          ctx.lineTo(c[i].x, c[i].y);
        }
        if(s != 0) {
          for(i in 0...pos) {
            ctx.lineTo(c[i].x, c[i].y);
          }
        }
      }
      ctx.stroke();
    }

    // boidz
    // z-sorting
    flock.boids.sort(function(a:Boid,b:Boid){
      return Reflect.compare(a.y, b.y) ;
    });

    for(b in flock.boids) {
      // ctx.beginPath();
      // ctx.fillStyle = crownColor;
      // ctx.arc(b.x, b.y, 1.5, 0, 2 * Math.PI, false);
      // ctx.fill();

      // ctx.beginPath();
      // ctx.fillStyle = boidColor;
      // ctx.arc(b.x, b.y, 3, 0, 2 * Math.PI, false);
      // ctx.fill();

    
    //count=count%8;
    var im= b.peopleImage;
    //find canvas height >
    
    var yFactor=(b.y/ctx.canvas.height)+0.3;
    var opacity=yFactor;
    ctx.globalAlpha = opacity;
   
    var wratio=im.width/im.height;
    var newH=300*yFactor;
    var newW=newH*wratio;
   ctx.drawImage(im,b.x-(newW/2),b.y-(newH/2),newW,newH);
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
