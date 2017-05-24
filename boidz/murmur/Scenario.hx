package murmur;
import boidz.render.canvas.*;
import boidz.rules.*;
class Scenario {
	var can:murmur.Canvas;
	var randomVelocity = false;
	var delay:Int;

	var scenarios=[];
	var counter=0;
	public function new(can:murmur.Canvas,delay:Int)
     
    {
    	this.can=can;
    	scenarios.push(scene1);
    	scenarios.push(scene2);
    	scenarios.push(scene3);
    	scenarios.push(scene4);
    	scenarios.push(scene5);

    	this.delay=delay;
    	var timer= new haxe.Timer(delay);
    	
    	timer.run=doScene;
    	//haxe.Timer.(doScene,delay);
    }


    function doScene(){
    	
    		var coun = Std.int(Math.abs(counter++ %scenarios.length));
    	trace( coun);
    	removeorAdd();
    	scenarios[coun]();
    }

    function scene1(){
    	can.velocity=.5;
    	can.updateVelocity();
    	can.waypoints.goals=[];
    	can.avoidCollisions.enabled=false;
    	can.avoidCollisions.radius=80;
    	can.DS.dispatch();
    }

    function scene2(){
    	can.velocity=.6;
    	can.updateVelocity();
   
  // can.flock.boids.splice(12, can.flock.boids.length - 12);

    	
    	can.avoidCollisions.enabled=true;
    	can.avoidCollisions.radius=80;
    	//can.zone=
    	can.DS.dispatch();
    }


    function scene3(){
    	can.velocity=.7;
    	can.updateVelocity();
    	// can.display.removeRenderable(can.zoneBounds);
    	// can.avoidCollisions.enabled=false;
    	// can.zoneBounds= new ZoneBounds(new RespectBoundaries(200, 800, 200, 500, 50, 25));

    	// can.zone= new SteerTowardZone(can.flock,can.zoneBounds);

    	// can.display.addRenderable(can.zoneBounds);
   		//  can.flock.addRule(can.zone);
    	can.DS.dispatch();
    }

    function scene4(){
    	can.velocity=.6;
    	can.updateVelocity();
    	//can.display.removeRenderable(can.zoneBounds);
    	can.avoidCollisions.enabled=false;
    	//can.zoneBounds= new ZoneBounds(new RespectBoundaries(400, 800, 200, 500, 50, 25));

   		can.waypoints.addGoal(Math.random()*can.width, Math.random()*can.height);
   // can.flock.addRule(can.zone);
    	can.DS.dispatch();
    }

    function scene5(){
    	can.velocity=.8;
    	can.updateVelocity();
    	
    	//can.zoneBounds= new ZoneBounds(new RespectBoundaries(400, 800, 200, 500, 50, 25));

   		
   		//can.flock.addRule(can.zone);
    	can.DS.dispatch();
    }


    function removeorAdd(){
    	var num = Std.random(10);
    	var rem:Bool=Random.bool();
    	//rem=false;
    	trace( 'num=$num rem=$rem');
    	if(rem){
    		if( num<can.flock.boids.length)
    		can.flock.boids.splice(0, num);
    	}else{
    	can.addBoids(can.flock, num , can.velocity, can.respectBoundaries.offset);
    	}
    }



    
}