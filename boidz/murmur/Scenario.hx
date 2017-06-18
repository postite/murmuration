package murmur;
import boidz.render.canvas.*;
import boidz.rules.*;
class Scenario {
	var can:murmur.Canvas;
	var randomVelocity = false;
	var delay:Int;

	var scenarios=[];
	var counter=0;
	public function new(can:murmur.Canvas)
     
    {
    	this.can=can;
    	scenarios.push(scene1);
    	scenarios.push(scene2);
    	scenarios.push(scene3);
    	scenarios.push(scene4);
    	scenarios.push(scene5);
	
    }

    public function addWalk(){
        can.walk.enabled=true;
        if (can.clientID==0)
        can.display.addRenderable(can.walk);
    }   
    public function removeWalk(){
        can.walk.enabled=false;
        can.display.addRenderable(can.walk);
    }

    public function act(value){
        trace( 'Sacenario Act $value');
        switch(value){
            case "walk": 
            can.walk= new Walk(0);
            addWalk();
            case "nowalk":
            removeWalk();
            case x:
            trace(x);
            Reflect.callMethod(this,Reflect.field(this,x),[]);
            
            //wait for last run ?
            

            
        }
    }
    

    function scene1(){
    	can.velocity=2;
    	can.updateVelocity();
    	can.waypoints.goals=[];
    	can.avoidCollisions.enabled=false;
    	can.avoidCollisions.radius=80;
    	can.DS.dispatch();
    }

    function scene2(){
    	can.velocity=.6;
    	can.updateVelocity();
        can.steerCenter.enabled=false;
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