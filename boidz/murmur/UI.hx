package murmur;
import boidz.Flock;
import thx.Timer;
using thx.Arrays;
using thx.Floats;
class UI {
// UI
// 
    
    var can:murmur.Canvas;
    var sui:sui.Sui;
    public function new(can:murmur.Canvas)
    {
      this.can=can;
      can.DS.add(update);
      //update();
    }

    public function update(){
    if( sui!=null){
     js.Browser.document.body.removeChild(sui.el);
      sui=null;
    }
    sui = new sui.Sui();
    
    var ui = sui.folder("flock");
    ui.int("boids",
      can.flock.boids.length, { min : 1, max : 3000 },
      function(v){
        if(v > can.flock.boids.length)
          can.addBoids(can.flock, v - can.flock.boids.length, can.velocity, can.respectBoundaries.offset);
        else
          can.flock.boids.splice(v, can.flock.boids.length - v);
      });
   

    ui.float("velocity",
      can.velocity, { min : 0, max : 20 },
      function(v){
        can.velocity = cast v;
        can.updateVelocity();
      });
    ui.bool("random velocity",
      can.randomVelocity,
      function(v) {
        can.randomVelocity = v;
        can.updateVelocity();
      });


    /*
    ui = ui.folder("render", { collapsible : false });
    ui.bind(canvasFlock.renderCentroid);
    ui.bind(canvasFlock.renderTrail);
    ui.bind(canvasFlock.trailLength, { min : 1, max : 400 });
*/
    ui = sui.folder("collisions");
    ui.bind(can.avoidCollisions.enabled);
    ui.bind(can.avoidCollisions.proportional);
    ui.bind(can.avoidCollisions.radius, { min : 0, max : 100 });
    ui.bind(can.avoidCollisions.maxSteer, { min : 1, max : 90 });


    ui = sui.folder("boundaries");
    ui.bind(can.respectBoundaries.enabled);
    ui.bind(can.respectBoundaries.offset, { min : 0, max : Math.min(can.width,can.height) / 2.1 });
    ui.bind(can.respectBoundaries.maxSteer, { min : 1, max : 90 });

    ui = ui.folder("render", { collapsible : false });
    ui.bind(can.canvasBoundaries.enabled);

    ui = sui.folder("waypoints");
    ui.bind(can.waypoints.enabled);
    ui.bind(can.waypoints.radius, { min : 1, max : 100 });
    ui.bind(can.waypoints.maxSteer, { min : 1, max : 90 });
    ui = ui.folder("render", { collapsible : false });
    ui.bind(can.canvasWaypoints.enabled);

   
   

    /// ui stuff
    /// 
    /// 
   
    ///
    
    // execution = sui.label("...", "execution time");
    // rendering = sui.label("...", "rendering time");
    // frameRate = sui.label("...", "frame rate");
   // #end
    sui.attach();
    //
    }
}