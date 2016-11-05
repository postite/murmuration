package murmur;
import boidz.Flock;
import thx.Timer;
using thx.Arrays;
using thx.Floats;
class UI {
// UI
// 
    //dependency
    var flock:Flock;
    var addBoids:Flock->Int->Float->Float->Void;
    
    var randomVelocity:Bool;
    var velocityfunc:Dynamic;
    //var velocity:Float;
    var respectBoundaries:boidz.rules.RespectBoundaries;
    // var canvasFlock;
    // var avoidCollisions;
    // var canvasBoundaries;
    // var waypoints;
    // var canvasWaypoints;

    public function new(
      display,
      flock:Flock,
      addBoids,
      velocity,
      respectBoundaries:boidz.rules.RespectBoundaries,
      avoidCollisions:boidz.rules.AvoidCollisions,
      canvasBoundaries:boidz.render.canvas.CanvasBoundaries,
      width,
      height,
      waypoints:boidz.rules.IndividualWaypoints,
      canvasWaypoints:boidz.render.canvas.CanvasIndividualWaypoints,
      execution,
      rendering,
      frameRate
      )
    {
      
    var sui = new sui.Sui();
    var ui = sui.folder("flock");
    ui.int("boids",
      flock.boids.length, { min : 1, max : 3000 },
      function(v){
        if(v > flock.boids.length)
          addBoids(flock, v - flock.boids.length, velocity, respectBoundaries.offset);
        else
          flock.boids.splice(v, flock.boids.length - v);
      });
    var randomVelocity = false;

    // velocityfunc =function updateVelocity(?vel=1) {
    //   for(boid in flock.boids)
    //     boid.v = vel * (randomVelocity ? Math.random() : 1);
    // }

    function updateVelocity() {
      for(boid in flock.boids)
        boid.v = velocity * (randomVelocity ? Math.random() : velocity);
    }

    ui.float("velocity",
      velocity, { min : 0, max : 20 },
      function(v){
        velocity = cast v;
        updateVelocity();
      });
    ui.bool("random velocity",
      randomVelocity,
      function(v) {
        randomVelocity = v;
        updateVelocity();
      });


    /*
    ui = ui.folder("render", { collapsible : false });
    ui.bind(canvasFlock.renderCentroid);
    ui.bind(canvasFlock.renderTrail);
    ui.bind(canvasFlock.trailLength, { min : 1, max : 400 });
*/
    ui = sui.folder("collisions");
    ui.bind(avoidCollisions.enabled);
    ui.bind(avoidCollisions.proportional);
    ui.bind(avoidCollisions.radius, { min : 0, max : 100 });
    ui.bind(avoidCollisions.maxSteer, { min : 1, max : 90 });


    ui = sui.folder("boundaries");
    ui.bind(respectBoundaries.enabled);
    ui.bind(respectBoundaries.offset, { min : 0, max : Math.min(width, height) / 2.1 });
    ui.bind(respectBoundaries.maxSteer, { min : 1, max : 90 });

    ui = ui.folder("render", { collapsible : false });
    ui.bind(canvasBoundaries.enabled);

    ui = sui.folder("waypoints");
    ui.bind(waypoints.enabled);
    ui.bind(waypoints.radius, { min : 1, max : 100 });
    ui.bind(waypoints.maxSteer, { min : 1, max : 90 });
    ui = ui.folder("render", { collapsible : false });
    ui.bind(canvasWaypoints.enabled);

   
   

    /// ui stuff
    /// 
    /// 
   
    ///
    
    execution = sui.label("...", "execution time");
    rendering = sui.label("...", "rendering time");
    frameRate = sui.label("...", "frame rate");
   // #end
    sui.attach();
    //
    }
}