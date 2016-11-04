package boidz.render.canvas;

import boidz.rules.IndividualWaypoints;
import boidz.IRenderable;

class TargetZone implements IRenderable<CanvasRender> {
  var zonePoints : Array<Point>;
  public var enabled : Bool = true;
  public function new(zonePoints : Array<Point>) {
    this.zonePoints = zonePoints;
  }

  public function render(render : CanvasRender) {
    var ctx = render.ctx;
    ctx.lineWidth = 1;
    ctx.setLineDash([2]);

    
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    for(p in zonePoints) {
      
      //ctx.strokeStyle = "#CCCCCC";
      

      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI, false);
      ctx.fill();

      
    }
  }
}