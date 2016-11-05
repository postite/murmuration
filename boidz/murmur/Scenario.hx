package murmur;

class Scenario {
	public function new(
      display,
      flock:boidz.Flock,
      addBoids,
      velocity,
      respectBoundaries:boidz.rules.RespectBoundaries,
      avoidCollisions:boidz.rules.AvoidCollisions,
      canvasBoundaries:boidz.render.canvas.CanvasBoundaries,
      width,
      height,
      waypoints:boidz.rules.IndividualWaypoints,
      canvasWaypoints:boidz.render.canvas.CanvasIndividualWaypoints
      )
    {
    	haxe.Timer.delay(doScene,2000);
    }


    function doScene(){
    	//velocity=3;
    }
}